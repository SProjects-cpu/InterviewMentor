"""
Vocabulary Questions for the Interview Mentor application.
These questions test knowledge of synonyms and antonyms.
"""

# Questions are organized as a list of dictionaries with the following structure:
# {
#     'id': 'unique_id',
#     'question': 'Question text',
#     'options': ['Option A', 'Option B', 'Option C', 'Option D'],
#     'answer': 'Correct option (e.g., "Option A")',
#     'explanation': 'Explanation of the answer (optional)',
#     'topic': 'Specific topic within vocabulary (e.g., "Synonyms", "Antonyms")'
# }

VOCABULARY_QUESTIONS = [
    # Synonyms
    {
        'id': 'vocab_syn_1',
        'question': 'CORPULENT is a synonym of:',
        'options': ['Lean', 'Gaunt', 'Emaciated', 'Obese'],
        'answer': 'Obese',
        'explanation': 'Corpulent means having a large, bulky body; fat. Obese is a synonym meaning extremely fat.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_2',
        'question': 'BRIEF is a synonym of:',
        'options': ['Limited', 'Small', 'Little', 'Short'],
        'answer': 'Short',
        'explanation': 'Brief means of short duration. Short is a synonym meaning not long in duration.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_3',
        'question': 'EMBEZZLE is a synonym of:',
        'options': ['Misappropriate', 'Balance', 'Remunerate', 'Clear'],
        'answer': 'Misappropriate',
        'explanation': 'Embezzle means to steal money that you are responsible for or that belongs to your employer. Misappropriate is a synonym meaning to use money or property illegally.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_4',
        'question': 'VENT is a synonym of:',
        'options': ['Opening', 'Stodge', 'End', 'Past tense of go'],
        'answer': 'Opening',
        'explanation': 'Vent means an opening that allows air, gas, or liquid to pass out of or into a confined space. Opening is a synonym.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_5',
        'question': 'AUGUST is a synonym of:',
        'options': ['Common', 'Ridiculous', 'Dignified', 'Petty'],
        'answer': 'Dignified',
        'explanation': 'August (when used as an adjective) means respected and impressive. Dignified is a synonym meaning having or showing a composed or serious manner.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_6',
        'question': 'CANNY is a synonym of:',
        'options': ['Obstinate', 'Handsome', 'Clever', 'Stout'],
        'answer': 'Clever',
        'explanation': 'Canny means having or showing shrewdness and good judgment. Clever is a synonym meaning mentally bright; having sharp or quick intelligence.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_7',
        'question': 'ALERT is a synonym of:',
        'options': ['Energetic', 'Observant', 'Intelligent', 'Watchful'],
        'answer': 'Watchful',
        'explanation': 'Alert means quick to notice any unusual and potentially dangerous or difficult circumstances. Watchful is a synonym meaning vigilant or attentive.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_8',
        'question': 'WARRIOR is a synonym of:',
        'options': ['Soldier', 'Sailor', 'Pirate', 'Spy'],
        'answer': 'Soldier',
        'explanation': 'Warrior means a brave or experienced soldier or fighter. Soldier is a synonym meaning a person who serves in an army.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_9',
        'question': 'DISTANT is a synonym of:',
        'options': ['Far', 'Removed', 'Reserved', 'Separate'],
        'answer': 'Far',
        'explanation': 'Distant means far away in space or time. Far is a synonym meaning at, to, or from a great distance.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_10',
        'question': 'ADVERSITY is a synonym of:',
        'options': ['Failure', 'Helplessness', 'Misfortune', 'Crisis'],
        'answer': 'Misfortune',
        'explanation': 'Adversity means difficulties or misfortune. Misfortune is a synonym meaning bad luck or an unfortunate condition.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_11',
        'question': 'FAKE is a synonym of:',
        'options': ['Original', 'Imitation', 'Trustworthy', 'Loyal'],
        'answer': 'Imitation',
        'explanation': 'Fake means not genuine; counterfeit. Imitation is a synonym meaning a thing intended to simulate or copy something else.',
        'topic': 'Synonyms'
    },
    {
        'id': 'vocab_syn_12',
        'question': 'INDICT is a synonym of:',
        'options': ['Condemn', 'Reprimand', 'Accuse', 'Allege'],
        'answer': 'Accuse',
        'explanation': 'Indict means to formally charge with a crime. Accuse is a synonym meaning to charge someone with an offense.',
        'topic': 'Synonyms'
    },
    
    # Antonyms
    {
        'id': 'vocab_ant_1',
        'question': 'ENORMOUS is an antonym of:',
        'options': ['Soft', 'Average', 'Tiny', 'Weak'],
        'answer': 'Tiny',
        'explanation': 'Enormous means very large in size, quantity, or extent. Tiny is an antonym meaning very small.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_2',
        'question': 'COMMISSIONED is an antonym of:',
        'options': ['Started', 'Closed', 'Finished', 'Terminated'],
        'answer': 'Terminated',
        'explanation': 'Commissioned means given the authority to perform a task or certain duties. Terminated is an antonym meaning brought to an end or conclusion.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_3',
        'question': 'ARTIFICIAL is an antonym of:',
        'options': ['Red', 'Natural', 'Truthful', 'Solid'],
        'answer': 'Natural',
        'explanation': 'Artificial means made or produced by human beings rather than occurring naturally. Natural is an antonym meaning existing in or derived from nature; not made or caused by humankind.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_4',
        'question': 'EXODUS is an antonym of:',
        'options': ['Influx', 'Home-coming', 'Return', 'Restoration'],
        'answer': 'Influx',
        'explanation': 'Exodus means a mass departure of people. Influx is an antonym meaning an arrival or entry of large numbers of people or things.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_5',
        'question': 'RELINQUISH is an antonym of:',
        'options': ['Abdicate', 'Renounce', 'Possess', 'Deny'],
        'answer': 'Possess',
        'explanation': 'Relinquish means to voluntarily cease to keep or claim; to give up. Possess is an antonym meaning to have as belonging to one; to own.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_6',
        'question': 'EXPAND is an antonym of:',
        'options': ['Convert', 'Condense', 'Congest', 'Conclude'],
        'answer': 'Condense',
        'explanation': 'Expand means to become or make larger or more extensive. Condense is an antonym meaning to make denser or more compact.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_7',
        'question': 'MORTAL is an antonym of:',
        'options': ['Divine', 'Immortal', 'Spiritual', 'Eternal'],
        'answer': 'Immortal',
        'explanation': 'Mortal means subject to death. Immortal is an antonym meaning living forever; never dying or decaying.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_8',
        'question': 'QUIESCENT is an antonym of:',
        'options': ['Active', 'Dormant', 'Weak', 'Unconcerned'],
        'answer': 'Active',
        'explanation': 'Quiescent means in a state or period of inactivity or dormancy. Active is an antonym meaning engaging or ready to engage in physically energetic pursuits.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_9',
        'question': 'OBEYING is an antonym of:',
        'options': ['Ordering', 'Following', 'Refusing', 'Contradicting'],
        'answer': 'Ordering',
        'explanation': 'Obeying means complying with an order or instruction. Ordering is an antonym meaning giving instructions or directions.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_10',
        'question': 'FRAUDULENT is an antonym of:',
        'options': ['Candid', 'Direct', 'Forthright', 'Genuine'],
        'answer': 'Genuine',
        'explanation': 'Fraudulent means obtained, done by, or involving deception. Genuine is an antonym meaning truly what something is said to be; authentic.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_11',
        'question': 'FLAGITIOUS is an antonym of:',
        'options': ['Innocent', 'Vapid', 'Ignorant', 'Frivolous'],
        'answer': 'Innocent',
        'explanation': 'Flagitious means (of a person or their actions) criminal, villainous, or extremely wicked. Innocent is an antonym meaning not guilty of a crime or offense.',
        'topic': 'Antonyms'
    },
    {
        'id': 'vocab_ant_12',
        'question': 'BELITTLE is an antonym of:',
        'options': ['Criticize', 'Flatter', 'Exaggerate', 'Adore'],
        'answer': 'Exaggerate',
        'explanation': 'Belittle means to dismiss (someone or something) as unimportant. Exaggerate is an antonym meaning to represent as being larger, better, or worse than in fact.',
        'topic': 'Antonyms'
    }
]

def get_vocabulary_questions_by_topic(topic):
    """
    Returns a list of vocabulary questions filtered by topic.
    
    Args:
        topic (str): The topic to filter by (e.g., 'Synonyms', 'Antonyms')
        
    Returns:
        list: A list of question dictionaries for the specified topic
    """
    return [q for q in VOCABULARY_QUESTIONS if q['topic'] == topic]

def get_all_vocabulary_topics():
    """
    Returns a list of all unique vocabulary topics.
    
    Returns:
        list: A list of unique topic strings
    """
    return list(set(q['topic'] for q in VOCABULARY_QUESTIONS)) 