def get_logical_puzzles_questions():
    """
    Returns a list of logical puzzles questions.
    """
    questions = [
        {
            'id': 'puzzle_1',
            'question': 'PUZZLE: In a family, if John is Mary\'s brother and Mary is Susan\'s sister, what is John to Susan?',
            'options': [
                'A. Father',
                'B. Brother',
                'C. Uncle',
                'D. Cousin'
            ],
            'answer': 'B',
            'explanation': 'John is Mary\'s brother, and Mary is Susan\'s sister. Since they share the same sibling relationship, John is Susan\'s brother.'
        },
        {
            'id': 'puzzle_2',
            'question': 'PUZZLE: Three friends—Alice, Bob, and Charlie—sit in a row. Alice is not next to Charlie. Bob is on the left end. Who is in the middle?',
            'options': [
                'A. Alice',
                'B. Charlie',
                'C. Bob',
                'D. It cannot be determined'
            ],
            'answer': 'A',
            'explanation': 'Bob is on the left end, so the order is Bob, X, Y. Alice is not next to Charlie, so Alice must be in the middle, making the order Bob, Alice, Charlie.'
        },
        {
            'id': 'puzzle_3',
            'question': 'PUZZLE: A man says, "If I am lying, then I am a knight." Is he a knight (who always tells the truth) or a knave (who always lies)?',
            'options': [
                'A. Knight',
                'B. Knave',
                'C. Either knight or knave',
                'D. Neither knight nor knave'
            ],
            'answer': 'B',
            'explanation': 'If he\'s a knight, he tells the truth, so "If I am lying" is false, but knights don\'t lie—a contradiction. If he\'s a knave, he lies, so the statement "If I am lying, then I am a knight" is false, which works since he\'s lying and not a knight.'
        },
        {
            'id': 'puzzle_4',
            'question': 'PUZZLE: Four people—A, B, C, D—stand in a line. A is not last. B is immediately before C. D is not first. Who is last?',
            'options': [
                'A. A',
                'B. B',
                'C. C',
                'D. D'
            ],
            'answer': 'C',
            'explanation': 'D is not first, A is not last, and B is before C. Possible order: D, A, B, C (D first, A not last, B before C, C last). C is last.'
        },
        {
            'id': 'puzzle_5',
            'question': 'PUZZLE: If it rains, the ground is wet. The ground is dry. What can be deduced?',
            'options': [
                'A. It is raining.',
                'B. It is not raining.',
                'C. The ground is always dry.',
                'D. It cannot be determined.'
            ],
            'answer': 'B',
            'explanation': 'If rain implies a wet ground and the ground is dry, it cannot be raining.'
        },
        {
            'id': 'puzzle_6',
            'question': 'PUZZLE: Three boxes are labeled "Apples," "Oranges," and "Mixed." All labels are wrong. You pick one fruit from the "Mixed" box and it\'s an apple. What\'s in the "Apples" box?',
            'options': [
                'A. Apples',
                'B. Oranges',
                'C. Mixed',
                'D. It cannot be determined'
            ],
            'answer': 'B',
            'explanation': 'All labels are wrong. "Mixed" has apples, so it\'s not mixed—it\'s apples only. "Apples" can\'t be apples, so it\'s oranges (since "Oranges" must be mixed).'
        },
        {
            'id': 'puzzle_7',
            'question': 'PUZZLE: Tom is taller than Sue. Sue is taller than Pam. Who is the shortest?',
            'options': [
                'A. Tom',
                'B. Sue',
                'C. Pam',
                'D. It cannot be determined'
            ],
            'answer': 'C',
            'explanation': 'Tom > Sue > Pam in height, so Pam is the shortest.'
        },
        {
            'id': 'puzzle_8',
            'question': 'PUZZLE: Two people, A and B, speak. A says, "B is a liar." B says, "A is telling the truth." How many are lying?',
            'options': [
                'A. None',
                'B. One',
                'C. Two',
                'D. It cannot be determined'
            ],
            'answer': 'B',
            'explanation': 'If A is truthful, B is a liar, but B\'s statement "A is truthful" would be a lie, consistent. If A lies, B\'s statement implies A is truthful—a contradiction. So A is truthful, B lies; one liar.'
        },
        {
            'id': 'puzzle_9',
            'question': 'PUZZLE: Five houses in a row are numbered 1 to 5. The red house is immediately left of the blue house. The blue house is number 3. What number is the red house?',
            'options': [
                'A. 1',
                'B. 2',
                'C. 4',
                'D. 5'
            ],
            'answer': 'B',
            'explanation': 'Blue is 3, and red is immediately left of blue, so red is 2.'
        },
        {
            'id': 'puzzle_10',
            'question': 'PUZZLE: Three friends—X, Y, Z—have different pets: dog, cat, bird. X does not have the bird. Y has the cat. Who has the dog?',
            'options': [
                'A. X',
                'B. Y',
                'C. Z',
                'D. It cannot be determined'
            ],
            'answer': 'C',
            'explanation': 'Y has the cat. X doesn\'t have the bird, so X has the dog or cat, but Y has the cat, so X has the dog is impossible. Thus, Z must have the dog, X the bird.'
        }
    ]
    
    return questions 