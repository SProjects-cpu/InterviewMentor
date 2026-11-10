@app.route('/career-guidance/feedback', methods=['GET', 'POST'])
@login_required
def career_guidance_feedback():
    if request.method == 'POST':
        feedback = request.form.get('feedback')
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO feedback (user_id, feedback, section) VALUES (?, ?, ?)', (current_user.id, feedback, 'career_guidance'))
        conn.commit()
        conn.close()
        return "Thank you for your feedback!", 200
    return render_template('career_guidance_feedback.html')