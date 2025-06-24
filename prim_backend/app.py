import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import psycopg2
from dotenv import load_dotenv
from datetime import date

# Load environment variables from .env file
load_dotenv()

db = SQLAlchemy()

app = Flask(__name__)

# Database connection function
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:Qpr38nyasha!@db.ppdpaetdtkxlbhfazfxl.supabase.co:5432/postgres"

db.init_app(app)

def get_db_connection():
    return psycopg2.connect(app.config['SQLALCHEMY_DATABASE_URI'])

# A simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Backend is running!"}), 200

# Endpoint to trigger new term billing
@app.route('/api/bill-new-term', methods=['POST'])
def bill_new_term():
    api_key = request.headers.get('X-Api-Key')
    if api_key != os.getenv('FLASK_API_KEY'):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    term_id = data.get('term_id')
    billing_date = data.get('billing_date', str(date.today())) # Default to today if not provided

    if not term_id:
        return jsonify({"error": "term_id is required"}), 400

    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Get term details and associated fees
        cur.execute("""
            SELECT tf.grade, tf.class, tf.tuition_amount_usd, tf.levy_amount_usd,
                   tf.tuition_amount_zwg, tf.levy_amount_zwg
            FROM public.TermFees tf
            WHERE tf.term_id = %s
        """, (term_id,))
        term_fees_configs = cur.fetchall()

        if not term_fees_configs:
            return jsonify({"error": f"No fee configurations found for term ID {term_id}"}), 404

        # Map grade/class to fees for quick lookup
        fees_map = {}
        for config in term_fees_configs:
            grade, _class, t_usd, l_usd, t_zwg, l_zwg = config
            key = (grade, _class) if _class else (grade, None) # Use None if class is not specific
            fees_map[key] = {
                'tuition_usd': t_usd,
                'levy_usd': l_usd,
                'tuition_zwg': t_zwg,
                'levy_zwg': l_zwg
            }

        # 2. Get all active students
        cur.execute("SELECT id, Grade, Class, Tuition_Owing, Levy_Owing FROM public.Students WHERE Status = 'active'")
        students = cur.fetchall()

        new_fee_records = []
        updated_student_balances = []

        for student in students:
            student_id, grade, _class, current_tuition_owing, current_levy_owing = student

            # Find applicable fees for the student's grade and class
            applicable_fees = fees_map.get((grade, _class))
            if not applicable_fees:
                # Fallback to grade-only if class-specific fees not found
                applicable_fees = fees_map.get((grade, None))

            if not applicable_fees:
                print(f"Warning: No fee config found for student {student_id} (Grade: {grade}, Class: {_class}). Skipping.")
                continue

            # Calculate new owing amounts
            new_tuition_charge_usd = applicable_fees['tuition_usd']
            new_levy_charge_usd = applicable_fees['levy_usd']
            new_tuition_charge_zwg = applicable_fees['tuition_zwg']
            new_levy_charge_zwg = applicable_fees['levy_zwg']

            # Update student's total owing
            updated_tuition_owing = current_tuition_owing + (new_tuition_charge_usd or 0)
            updated_levy_owing = current_levy_owing + (new_levy_charge_usd or 0)

            updated_student_balances.append((updated_tuition_owing, updated_levy_owing, student_id))

            # Prepare new Fee records for USD and ZWG (if applicable)
            # Log new tuition charge
            if new_tuition_charge_usd and new_tuition_charge_usd > 0:
                new_fee_records.append((student_id, billing_date, new_tuition_charge_usd, 'tuition', 'usd', new_tuition_charge_usd))
            if new_tuition_charge_zwg and new_tuition_charge_zwg > 0:
                new_fee_records.append((student_id, billing_date, new_tuition_charge_zwg, 'tuition', 'zwg', new_tuition_charge_usd or 0)) # USD_equivalent needs review

            # Log new levy charge
            if new_levy_charge_usd and new_levy_charge_usd > 0:
                new_fee_records.append((student_id, billing_date, new_levy_charge_usd, 'levy', 'usd', new_levy_charge_usd))
            if new_levy_charge_zwg and new_levy_charge_zwg > 0:
                new_fee_records.append((student_id, billing_date, new_levy_charge_zwg, 'levy', 'zwg', new_levy_charge_usd or 0)) # USD_equivalent needs review

        # 3. Update student balances
        update_query = """
            UPDATE public.Students
            SET Tuition_Owing = %s, Levy_Owing = %s
            WHERE id = %s
        """
        if updated_student_balances:
            cur.executemany(update_query, updated_student_balances)

        # 4. Insert new fee records
        insert_fees_query = """
            INSERT INTO public.Fees (StudentID, Date, Amount, Type, Currency, USD_equivalent)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        if new_fee_records:
            cur.executemany(insert_fees_query, new_fee_records)

        conn.commit()
        return jsonify({"message": f"Successfully billed {len(updated_student_balances)} active students for term {term_id}"}), 200

    except Exception as e:
        if conn:
            conn.rollback() # Rollback in case of error
        print(f"Error during billing: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    # For development, run on all available IPs, default port 5000
    app.run(debug=True, host='0.0.0.0', port=5000)