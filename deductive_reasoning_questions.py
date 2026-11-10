def get_deductive_reasoning_questions():
    """
    Returns a list of deductive reasoning questions.
    """
    questions = [
        {
            'id': 'deductive_1',
            'question': 'INSCRUTABLE - ',
            'options': [
                'A. Obvious',
                'B. Clear',
                'C. Mysterious',
                'D. Simple'
            ],
            'answer': 'C',
            'explanation': '"Inscrutable" means difficult to understand or interpret, aligning with "mysterious."'
        },
        {
            'id': 'deductive_2',
            'question': 'PREMISE: All doctors are trained in medicine. Some trained medical professionals are surgeons. - ',
            'options': [
                'A. All doctors are surgeons.',
                'B. Some doctors are surgeons.',
                'C. No doctors are surgeons.',
                'D. It cannot be determined if doctors are surgeons.'
            ],
            'answer': 'D',
            'explanation': 'While all doctors are trained in medicine, the premise doesn\'t specify if they are among the surgeons, so it\'s indeterminable.'
        },
        {
            'id': 'deductive_3',
            'question': 'SUPERFLUOUS - ',
            'options': [
                'A. Necessary',
                'B. Essential',
                'C. Excessive',
                'D. Vital'
            ],
            'answer': 'C',
            'explanation': '"Superfluous" means more than needed, matching "excessive."'
        },
        {
            'id': 'deductive_4',
            'question': 'PREMISE: No cats are dogs. All poodles are dogs. - ',
            'options': [
                'A. Poodles are cats.',
                'B. No poodles are cats.',
                'C. Some poodles are cats.',
                'D. It cannot be determined if poodles are cats.'
            ],
            'answer': 'B',
            'explanation': 'Since no cats are dogs and all poodles are dogs, poodles cannot be cats.'
        },
        {
            'id': 'deductive_5',
            'question': 'FRAUGHT - ',
            'options': [
                'A. Calm',
                'B. Peaceful',
                'C. Filled with',
                'D. Empty'
            ],
            'answer': 'C',
            'explanation': '"Fraught" means filled with something (often negative), making "filled with" the best fit.'
        },
        {
            'id': 'deductive_6',
            'question': 'PREMISE: All students in the class passed the exam. Maria is a student in the class. - ',
            'options': [
                'A. Maria failed the exam.',
                'B. Maria passed the exam.',
                'C. Maria did not take the exam.',
                'D. It cannot be determined if Maria passed the exam.'
            ],
            'answer': 'B',
            'explanation': 'If all students passed and Maria is a student, she must have passed.'
        },
        {
            'id': 'deductive_7',
            'question': 'DISPARAGE - ',
            'options': [
                'A. Praise',
                'B. Criticize',
                'C. Support',
                'D. Encourage'
            ],
            'answer': 'B',
            'explanation': '"Disparage" means to belittle or criticize, aligning with "criticize."'
        },
        {
            'id': 'deductive_8',
            'question': 'PREMISE: Some writers are poets. All poets are creative. - ',
            'options': [
                'A. All writers are creative.',
                'B. Some writers are creative.',
                'C. No writers are creative.',
                'D. It cannot be determined if writers are creative.'
            ],
            'answer': 'B',
            'explanation': 'Since some writers are poets and all poets are creative, at least some writers must be creative.'
        },
        {
            'id': 'deductive_9',
            'question': 'PLACID - ',
            'options': [
                'A. Agitated',
                'B. Calm',
                'C. Restless',
                'D. Turbulent'
            ],
            'answer': 'B',
            'explanation': '"Placid" means peaceful or calm, matching "calm."'
        },
        {
            'id': 'deductive_10',
            'question': 'PREMISE: No reptiles are mammals. All snakes are reptiles. - ',
            'options': [
                'A. Snakes are mammals.',
                'B. No snakes are mammals.',
                'C. Some snakes are mammals.',
                'D. It cannot be determined if snakes are mammals.'
            ],
            'answer': 'B',
            'explanation': 'If no reptiles are mammals and all snakes are reptiles, no snakes can be mammals.'
        },
        {
            'id': 'deductive_11',
            'question': 'VINDICATE - ',
            'options': [
                'A. Condemn',
                'B. Blame',
                'C. Justify',
                'D. Accuse'
            ],
            'answer': 'C',
            'explanation': '"Vindicate" means to clear of blame or justify, aligning with "justify."'
        },
        {
            'id': 'deductive_12',
            'question': 'PREMISE: All employees in the company wear uniforms. Some employees work remotely. - ',
            'options': [
                'A. All remote workers wear uniforms.',
                'B. Some remote workers wear uniforms.',
                'C. No remote workers wear uniforms.',
                'D. It cannot be determined if remote workers wear uniforms.'
            ],
            'answer': 'B',
            'explanation': 'Since all employees wear uniforms and some employees are remote workers, at least some remote workers must wear uniforms.'
        }
    ]
    
    return questions 