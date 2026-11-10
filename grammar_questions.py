"""
Grammar and Usage Questions for the Interview Mentor application.
These questions test the ability to identify grammatical errors in sentences.
"""

# Questions are organized as a list of dictionaries with the following structure:
# {
#     'id': 'unique_id',
#     'instruction': 'General instruction for all grammar questions',
#     'question': 'The sentence with potential grammatical errors',
#     'parts': ['Part A', 'Part B', 'Part C'],
#     'options': ['Option A', 'Option B', 'Option C', 'Option D'],
#     'answer': 'Correct option (e.g., "Option A")',
#     'explanation': 'Explanation of the answer (optional)',
#     'topic': 'Grammar & Usage'
# }

# Common instruction for all grammar questions
GRAMMAR_INSTRUCTION = 'Read each sentence to find out whether there is any grammatical error in it. The error, if any will be in one part of the sentence. The letter of that part is the answer. If there is no error, the answer is \'D\'. (Ignore the errors of punctuation, if any).'

GRAMMAR_QUESTIONS = [
    {
        'id': 'grammar_1',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['We discussed about the problem so thoroughly', 'on the eve of the examination', 'that I found it very easy to work it out'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option A',
        'explanation': 'In part A, "discussed about" is incorrect. The correct form is simply "discussed" without "about" as "discuss" is a transitive verb that doesn\'t need a preposition.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_2',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['An Indian ship', 'laden with merchandise', 'got drowned in the Pacific Ocean.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option C',
        'explanation': 'In part C, "got drowned" is incorrect. The correct form is "sank" or "was drowned" as ships sink, they don\'t "get drowned".',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_3',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['I could not put up in a hotel', 'because the boarding and lodging charges', 'were exorbitant.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option A',
        'explanation': 'In part A, "put up in" is incorrect. The correct phrase is "put up at" when referring to staying at a hotel.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_4',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['The Indian radio', 'which was previously controlled by the British rulers', 'is free now from the narrow vested interests.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option C',
        'explanation': 'In part C, "the narrow vested interests" is incorrect. It should be "narrow vested interests" without "the" as we\'re not referring to specific interests.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_5',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['If I had known', 'this yesterday', 'I will have helped him.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option C',
        'explanation': 'In part C, "I will have helped him" is incorrect. In a conditional sentence referring to the past, it should be "I would have helped him."',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_6',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['A lot of travel delay is caused', 'due to the inefficiency and lack of good management', 'on behalf of the railways.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option C',
        'explanation': 'In part C, "on behalf of" is incorrect. It should be "on the part of" as "on behalf of" means "in the interest of" while "on the part of" indicates responsibility.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_7',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['One of the members', 'expressed doubt if', 'the Minister was an atheist.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "expressed doubt if" is incorrect. It should be "expressed doubt whether" or "expressed doubt that" as "if" is not appropriate in this context.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_8',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['I have got', 'my M.Sc. degree', 'in 1988.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option A',
        'explanation': 'In part A, "I have got" with a specific past time (in 1988) is incorrect. It should be "I got" as we use simple past tense with a specific time in the past.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_9',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['Having received your letter', 'this morning, we are writing', 'to thank you for the same.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'No error.',
        'explanation': 'There is no grammatical error in this sentence. All parts are correctly structured.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_10',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['If you lend him a book', 'he will lend it to some one else', 'and never you will get it back.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option C',
        'explanation': 'In part C, "never you will get it back" has incorrect word order. It should be "you will never get it back."',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_11',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['According to the Bible', 'it is meek and humble', 'who shall inherit the earth.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "it is meek and humble" is incorrect. It should be "it is the meek and humble" as we\'re referring to a group of people.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_12',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['Do the roses in your garden smell', 'more sweetly', 'than those in ours?'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "more sweetly" is incorrect. It should be "sweeter" as we use the comparative form of the adjective "sweet" after "smell" rather than the adverb form.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_13',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['Block of Residential flats', 'are coming up', 'near our house.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option A',
        'explanation': 'In part A, "Block of Residential flats" is incorrect. It should be "Blocks of residential flats" as the verb "are" indicates plural subject.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_14',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['You can get', 'all the information that you want', 'in this book.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "all the information that you want" is incorrect. It should be "all the information you want" as "that" is redundant in this context.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_15',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['The students were', 'awaiting for', 'the arrival of the chief guest.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "awaiting for" is incorrect. It should be either "awaiting" or "waiting for" as "await" is a transitive verb that doesn\'t need the preposition "for".',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_16',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['Neither of the contestants', 'have shown', 'any special talent.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "have shown" is incorrect. It should be "has shown" as "Neither" is singular and requires a singular verb.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_17',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['The reason why', 'he failed', 'is because he was careless.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option C',
        'explanation': 'In part C, "is because" is redundant. It should be either "is that" or simply "because" as "the reason" and "because" serve the same purpose.',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_18',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['No sooner did I reach', 'the station when', 'the train arrived.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "when" is incorrect. The correct structure for "No sooner... than" requires "than" instead of "when".',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_19',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['He is one of those people', 'who does not know', 'how to behave in public.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option B',
        'explanation': 'In part B, "does not know" is incorrect. It should be "do not know" as "one of those people who" requires a plural verb because "who" refers to "people" not "one".',
        'topic': 'Grammar & Usage'
    },
    {
        'id': 'grammar_20',
        'instruction': GRAMMAR_INSTRUCTION,
        'question': '(solve as per the direction given above)',
        'parts': ['The committee', 'has submitted', 'their report.'],
        'options': ['Option A', 'Option B', 'Option C', 'No error.'],
        'answer': 'Option C',
        'explanation': 'In part C, "their report" is incorrect. Since "committee" is treated as a singular entity (as indicated by "has" in part B), it should be "its report" not "their report" for consistency.',
        'topic': 'Grammar & Usage'
    }
]

def get_grammar_questions():
    """
    Returns all grammar and usage questions.
    
    Returns:
        list: A list of grammar question dictionaries
    """
    return GRAMMAR_QUESTIONS 