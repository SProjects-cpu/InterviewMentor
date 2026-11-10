"""
Reading Comprehension Questions for the Interview Mentor application.
These questions test the ability to understand and analyze written passages.
"""

# Reading comprehension passages and questions are organized as a list of dictionaries with the following structure:
# {
#     'id': 'unique_id',
#     'passage': 'The reading passage text',
#     'questions': [
#         {
#             'id': 'question_id',
#             'question': 'Question text',
#             'options': ['Option A', 'Option B', 'Option C', 'Option D'],
#             'answer': 'Correct option (e.g., "Option A")',
#             'explanation': 'Explanation of the answer (optional)'
#         },
#         # More questions for this passage...
#     ]
# }

READING_COMPREHENSION_PASSAGES = [
    # Passage 1
    {
        'id': 'passage_1',
        'passage': 'I felt the wall of the tunnel shiver. The master alarm squealed through my earphones. Almost simultaneously, Jack yelled down to me that there was a warning light on. Fleeting but spectacular sights snapped into ans out of view, the snow, the shower of debris, the moon, looming close and big, the dazzling sunshine for once unfiltered by layers of air. The last twelve hours before re-entry were particular bone-chilling. During this period, I had to go up in to command module. Even after the fiery re-entry splashing down in 81o water in south pacific, we could still see our frosty breath inside the command module.',
        'questions': [
            {
                'id': 'comp_1_1',
                'question': 'The word \'Command Module\' used twice in the given passage indicates perhaps that it deals with',
                'options': ['an alarming journey', 'a commanding situation', 'a journey into outer space', 'a frightful battle'],
                'answer': 'a journey into outer space',
                'explanation': 'The passage mentions space-related elements like the moon, re-entry, and the command module, which is a component of a spacecraft.'
            },
            {
                'id': 'comp_1_2',
                'question': 'Which one of the following reasons would one consider as more as possible for the warning lights to be on?',
                'options': ['There was a shower of debris.', 'Jack was yelling.', 'A catastrophe was imminent.', 'The moon was looming close and big.'],
                'answer': 'A catastrophe was imminent.',
                'explanation': 'The warning lights, alarm, and the shivering wall all indicate an emergency situation where a catastrophe was about to happen.'
            },
            {
                'id': 'comp_1_3',
                'question': 'The statement that the dazzling sunshine was "for once unfiltered by layers of air" means',
                'options': ['that the sun was very hot', 'that there was no strong wind', 'that the air was unpolluted', 'none of above'],
                'answer': 'none of above',
                'explanation': 'The statement implies they were in space, where there is no atmosphere to filter the sunlight, unlike on Earth where the atmosphere filters the sun\'s rays.'
            }
        ]
    },
    
    # Passage 2
    {
        'id': 'passage_2',
        'passage': 'Until the end of his first year at school, Cyril retained many of the pleasures and pursuits he had brought with him from home, and he kept an old interest in butterflies and fossils. His grandmother had presented him with a fine bird\'s eggs cabinet, but he could never bring himself to risk in climbing trees. Once or twice he dissected dead birds from sheer determination to overcome his horror of the operation. Probably it was his envy of those physically unlike himself that brought on a phase during which he drew massive athletes with thick necks and square shoulders. Again he was pitying himself for what he could never be.',
        'questions': [
            {
                'id': 'comp_2_1',
                'question': 'The reason Why Cyril made drawings of athletes was that',
                'options': ['though he admired them, he lacked a fine physique himself', 'he loved violent exercises', 'athletics was a passion with him', 'he had to complete an assignment'],
                'answer': 'though he admired them, he lacked a fine physique himself',
                'explanation': 'The passage states "Probably it was his envy of those physically unlike himself" and "he was pitying himself for what he could never be," indicating he drew athletes because he admired their physique that he lacked.'
            },
            {
                'id': 'comp_2_2',
                'question': 'Cyril dissected dead birds to',
                'options': ['see if he would like to become a doctor', 'please his grandmother', 'satisfy his curiosity', 'overcome the fear of act'],
                'answer': 'overcome the fear of act',
                'explanation': 'The passage states he dissected birds "from sheer determination to overcome his horror of the operation," indicating he was trying to overcome his fear of the act.'
            },
            {
                'id': 'comp_2_3',
                'question': 'Until the end of first year, Cyril retained his interest in',
                'options': ['bird\'s eggs', 'butterflies and fossils', 'dissecting bird\'s', 'drawing pictures of athletes'],
                'answer': 'butterflies and fossils',
                'explanation': 'The passage explicitly states "he kept an old interest in butterflies and fossils."'
            },
            {
                'id': 'comp_2_4',
                'question': 'Cyril did not want to climb trees because he',
                'options': ['loved to play on the ground', 'was scared of falling down', 'disliked trees', 'thought it was childish'],
                'answer': 'was scared of falling down',
                'explanation': 'The passage states "he could never bring himself to risk in climbing trees," suggesting he was afraid of the risk involved, which would be falling down.'
            },
            {
                'id': 'comp_2_5',
                'question': 'Cyril\'s early schooling was in some ways like home life because',
                'options': ['he had all his old friends with him', 'the food and the climate were same as at home', 'he kept an doing what gave joy and recreation at home', 'his family visited him often'],
                'answer': 'he kept an doing what gave joy and recreation at home',
                'explanation': 'The passage states "Cyril retained many of the pleasures and pursuits he had brought with him from home," indicating he continued activities that gave him joy at home.'
            }
        ]
    },
    
    # Passage 3
    {
        'id': 'passage_3',
        'passage': 'But I did not want to shoot the elephant. I watched him beating his bunch of grass against his knees, with the preoccupied grandmotherly air that elephants have. It seemed to me that it would be murder to shoot him. I had never shot an elephant and never wanted to. (Somehow it always seems worse to kill large animal.) Besides, there was the beast\'s owner to be considered. But I had got to act quickly. I turned to some experienced-looking Burmans who had been there when we arrived, and asked them how the elephants had been behaving. They all said the same thing; he took no notice of you if you left him alone, but he might charge if you went too close to him.',
        'questions': [
            {
                'id': 'comp_3_1',
                'question': 'The phrase \'Preoccupied grandmotherly air\' signifies',
                'options': ['being totally unconcerned', 'pretending to be very busy', 'a very superior attitude', 'calm, dignified and affectionate disposition'],
                'answer': 'calm, dignified and affectionate disposition',
                'explanation': 'The phrase describes the elephant\'s demeanor as calm, dignified, and affectionate, similar to a grandmother\'s caring nature.'
            },
            {
                'id': 'comp_3_2',
                'question': 'From the passage it appears that the author was',
                'options': ['an inexperienced hunter', 'kind and considerate', 'possessed with fear', 'a worried man'],
                'answer': 'kind and considerate',
                'explanation': 'The author shows kindness and consideration by not wanting to shoot the elephant, feeling it would be "murder," and considering the beast\'s owner.'
            },
            {
                'id': 'comp_3_3',
                'question': 'The author did not want to shoot the elephant because he',
                'options': ['was afraid of it', 'did not have the experience of shooting big animals', 'did not wish to kill animal which was not doing anybody any harm', 'did not find the elephant to be ferocious'],
                'answer': 'did not have the experience of shooting big animals',
                'explanation': 'The passage states "I had never shot an elephant and never wanted to," indicating his lack of experience with shooting large animals.'
            }
        ]
    },
    
    # Passage 4
    {
        'id': 'passage_4',
        'passage': 'The world\'s oceans are in a state of crisis. Rising temperatures, pollution, and overfishing threaten marine ecosystems globally. Coral reefs, often called the rainforests of the sea, are particularly vulnerable. Scientists estimate that over 50% of the world\'s coral reefs have died in the last 30 years, and up to 90% may die within the next century if current trends continue. This loss affects not only marine biodiversity but also the livelihoods of over 500 million people who depend on healthy reefs for food, coastal protection, and income from tourism.',
        'questions': [
            {
                'id': 'comp_4_1',
                'question': 'According to the passage, coral reefs are compared to:',
                'options': ['Deserts', 'Mountains', 'Rainforests', 'Grasslands'],
                'answer': 'Rainforests',
                'explanation': 'The passage explicitly states that coral reefs are "often called the rainforests of the sea."'
            },
            {
                'id': 'comp_4_2',
                'question': 'How many people depend on healthy coral reefs according to the passage?',
                'options': ['50 million', '90 million', '500 million', '30 million'],
                'answer': '500 million',
                'explanation': 'The passage states that "the livelihoods of over 500 million people who depend on healthy reefs."'
            }
        ]
    },
    
    # Passage 5
    {
        'id': 'passage_5',
        'passage': 'Artificial intelligence has made remarkable progress in recent years, with applications ranging from healthcare to transportation. However, this rapid advancement has raised concerns about job displacement. A 2020 study by the World Economic Forum predicted that AI and automation could displace 85 million jobs globally by 2025. At the same time, the report suggested that these technologies may create 97 million new roles, though these will require different skills than many of the jobs being eliminated. This technological transition presents both challenges and opportunities for workers and economies worldwide.',
        'questions': [
            {
                'id': 'comp_5_1',
                'question': 'According to the passage, what is a concern raised by the rapid advancement of AI?',
                'options': ['Environmental damage', 'Job displacement', 'Political instability', 'Cultural decline'],
                'answer': 'Job displacement',
                'explanation': 'The passage explicitly mentions "concerns about job displacement" as a result of AI advancement.'
            },
            {
                'id': 'comp_5_2',
                'question': 'The World Economic Forum study predicted that AI and automation would:',
                'options': ['Create more jobs than they eliminate', 'Eliminate more jobs than they create', 'Have no net effect on employment', 'Only affect developing economies'],
                'answer': 'Create more jobs than they eliminate',
                'explanation': 'The passage states that AI could displace 85 million jobs but create 97 million new roles, indicating a net positive job creation.'
            }
        ]
    },
    
    # Passage 6
    {
        'id': 'passage_6',
        'passage': 'The human brain remains one of the most complex and mysterious organs in the body. Weighing approximately three pounds, it contains about 86 billion neurons and an equal number of non-neuronal cells. Despite centuries of study, scientists have only begun to understand how these cells work together to create consciousness, store memories, and process the vast amount of information we encounter daily. Recent advances in neuroimaging have allowed researchers to observe brain activity in real-time, revealing that even simple tasks activate multiple regions simultaneously in intricate patterns of communication.',
        'questions': [
            {
                'id': 'comp_6_1',
                'question': 'According to the passage, approximately how many neurons does the human brain contain?',
                'options': ['3 billion', '86 billion', '100 million', '1 trillion'],
                'answer': '86 billion',
                'explanation': 'The passage explicitly states that the human brain "contains about 86 billion neurons."'
            },
            {
                'id': 'comp_6_2',
                'question': 'What recent technological advancement has helped scientists study the brain?',
                'options': ['Blood tests', 'Genetic sequencing', 'Neuroimaging', 'Artificial intelligence'],
                'answer': 'Neuroimaging',
                'explanation': 'The passage mentions that "recent advances in neuroimaging have allowed researchers to observe brain activity in real-time."'
            }
        ]
    },
    
    # Passage 7
    {
        'id': 'passage_7',
        'passage': 'The Renaissance, which began in 14th-century Italy and spread throughout Europe over the next three centuries, marked a period of enormous cultural and intellectual growth. Following the Middle Ages, this era saw a renewed interest in classical learning and values. Artists like Leonardo da Vinci and Michelangelo created works that showcased perspective and realism, while writers such as Shakespeare explored the depth of human experience through their plays and sonnets. The invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of knowledge, making books more accessible and contributing to increased literacy rates across Europe.',
        'questions': [
            {
                'id': 'comp_7_1',
                'question': 'Where did the Renaissance begin?',
                'options': ['France', 'England', 'Italy', 'Germany'],
                'answer': 'Italy',
                'explanation': 'The passage states that the Renaissance "began in 14th-century Italy."'
            },
            {
                'id': 'comp_7_2',
                'question': 'According to the passage, what invention revolutionized the spread of knowledge during the Renaissance?',
                'options': ['The telescope', 'The printing press', 'The compass', 'The steam engine'],
                'answer': 'The printing press',
                'explanation': 'The passage states that "the invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of knowledge."'
            }
        ]
    }
]

def get_reading_comprehension_questions():
    """
    Returns all reading comprehension questions in a flat list format suitable for the test.
    
    Returns:
        list: A list of question dictionaries with passage included in each question
    """
    questions = []
    
    for passage_data in READING_COMPREHENSION_PASSAGES:
        passage_text = passage_data['passage']
        
        for question_data in passage_data['questions']:
            questions.append({
                'id': question_data['id'],
                'passage': passage_text,
                'question': question_data['question'],
                'options': question_data['options'],
                'answer': question_data['answer'],
                'explanation': question_data.get('explanation', ''),
                'topic': 'Reading Comprehension'
            })
    
    return questions 