"""
Arithmetic Aptitude Questions for the Interview Mentor application.
These questions are organized by topic and include multiple choice options and correct answers.
"""

# Questions are organized as a list of dictionaries with the following structure:
# {
#     'id': 'unique_id',
#     'question': 'Question text',
#     'options': ['Option A', 'Option B', 'Option C', 'Option D'],
#     'answer': 'Correct option (e.g., "Option A")',
#     'explanation': 'Explanation of the answer (optional)',
#     'topic': 'Specific topic within arithmetic (e.g., "Percentages", "Profit and Loss")'
# }

ARITHMETIC_QUESTIONS = [
    # Percentages
    {
        'id': 'arith_percent_1',
        'question': "If A's salary is 40% more than B's salary, then B's salary is what percent less than A's salary?",
        'options': ['25%', '28.57%', '30%', '35%'],
        'answer': '28.57%',
        'explanation': 'If B\'s salary is x, then A\'s salary is 1.4x. The percentage by which B\'s salary is less than A\'s is: (1.4x - x)/1.4x × 100 = 0.4/1.4 × 100 = 28.57%',
        'topic': 'Percentages'
    },
    {
        'id': 'arith_percent_2',
        'question': 'A man spends 75% of his income. His income is increased by 20% and his expenditure also increases by 10%. Find the percentage increase in his savings.',
        'options': ['30%', '40%', '50%', '60%'],
        'answer': '50%',
        'explanation': 'Let original income be 100 and expenditure be 75, so savings = 25. New income = 120, new expenditure = 75 × 1.1 = 82.5, new savings = 37.5. Percentage increase in savings = (37.5 - 25)/25 × 100 = 50%',
        'topic': 'Percentages'
    },
    {
        'id': 'arith_percent_3',
        'question': 'In an examination, 80% of the students passed in English, 85% passed in Mathematics, and 75% passed in both English and Mathematics. The percentage of students who failed in both subjects is:',
        'options': ['5%', '10%', '15%', '20%'],
        'answer': '10%',
        'explanation': 'Using the formula: P(A ∪ B) = P(A) + P(B) - P(A ∩ B), we get percentage of students who passed in at least one subject = 80 + 85 - 75 = 90%. So, percentage who failed in both = 100 - 90 = 10%',
        'topic': 'Percentages'
    },
    
    # Profit and Loss
    {
        'id': 'arith_profit_1',
        'question': 'A shopkeeper sells an article at a profit of 20%. If he had bought it at 20% less cost and sold it for Rs. 50 less, he would have made a profit of 25%. Find the cost price of the article.',
        'options': ['Rs. 500', 'Rs. 600', 'Rs. 750', 'Rs. 800'],
        'answer': 'Rs. 500',
        'explanation': 'Let the cost price be x. Then 1.2x - (0.8x × 1.25) = 50, which gives x = 500',
        'topic': 'Profit and Loss'
    },
    {
        'id': 'arith_profit_2',
        'question': 'A man buys an article for Rs. 600 and sells it at a loss of 10%. For how much should he have sold it to gain a profit of 10%?',
        'options': ['Rs. 660', 'Rs. 720', 'Rs. 540', 'Rs. 600'],
        'answer': 'Rs. 660',
        'explanation': 'Cost price = Rs. 600. Selling price at 10% loss = 600 × 0.9 = Rs. 540. Selling price at 10% profit = 600 × 1.1 = Rs. 660',
        'topic': 'Profit and Loss'
    },
    {
        'id': 'arith_profit_3',
        'question': 'A trader mixes 26 kg of rice at Rs. 20 per kg with 30 kg of rice at Rs. 36 per kg and sells the mixture at Rs. 30 per kg. His profit percent is:',
        'options': ['5%', '8%', '10%', '12%'],
        'answer': '8%',
        'explanation': 'Total cost = 26 × 20 + 30 × 36 = 520 + 1080 = 1600. Total selling price = 56 × 30 = 1680. Profit = 1680 - 1600 = 80. Profit percentage = (80/1000) × 100 = 8%',
        'topic': 'Profit and Loss'
    },
    
    # Simple Interest and Compound Interest
    {
        'id': 'arith_interest_1',
        'question': 'A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:',
        'options': ['Rs. 698', 'Rs. 700', 'Rs. 720', 'Rs. 737'],
        'answer': 'Rs. 698',
        'explanation': 'Let the principal be P and rate be R. Then, P + P×R×3/100 = 815 and P + P×R×4/100 = 854. Solving these equations: P = 698',
        'topic': 'Simple Interest'
    },
    {
        'id': 'arith_interest_2',
        'question': 'The compound interest on Rs. 30,000 at 7% per annum for 3 years, compounded annually, is:',
        'options': ['Rs. 6,300', 'Rs. 6,720.25', 'Rs. 6,727.50', 'Rs. 6,810'],
        'answer': 'Rs. 6,727.50',
        'explanation': 'CI = P[(1 + R/100)^T - 1] = 30000[(1 + 7/100)^3 - 1] = 30000[1.225043 - 1] = 30000 × 0.225043 = 6,727.50',
        'topic': 'Compound Interest'
    },
    {
        'id': 'arith_interest_3',
        'question': 'The difference between simple and compound interests compounded annually on a certain sum of money for 2 years at 4% per annum is Rs. 4. The sum is:',
        'options': ['Rs. 2,000', 'Rs. 2,500', 'Rs. 3,000', 'Rs. 4,000'],
        'answer': 'Rs. 2,500',
        'explanation': 'Let the principal be P. CI - SI = P[(1 + 4/100)^2 - 1] - P×4×2/100 = P[1.0816 - 1 - 0.08] = 0.0016P = 4. So, P = 2,500',
        'topic': 'Interest Comparison'
    },
    
    # Time and Work
    {
        'id': 'arith_time_1',
        'question': 'A can do a piece of work in 10 days and B can do it in 15 days. They work together for 5 days, after which A leaves. How many more days will B take to complete the remaining work?',
        'options': ['3 days', '4 days', '5 days', '6 days'],
        'answer': '3 days',
        'explanation': 'A\'s one day work = 1/10, B\'s one day work = 1/15. In 5 days, they complete (1/10 + 1/15) × 5 = 5/6 of the work. Remaining work = 1 - 5/6 = 1/6. B will take (1/6) ÷ (1/15) = 2.5 days, which rounds to 3 days',
        'topic': 'Time and Work'
    },
    {
        'id': 'arith_time_2',
        'question': 'A and B together can complete a piece of work in 12 days. A alone can complete it in 20 days. In how many days can B alone complete the work?',
        'options': ['20 days', '30 days', '24 days', '40 days'],
        'answer': '30 days',
        'explanation': 'A\'s one day work = 1/20, (A+B)\'s one day work = 1/12. So, B\'s one day work = 1/12 - 1/20 = (5-3)/60 = 2/60 = 1/30. Therefore, B takes 30 days to complete the work alone',
        'topic': 'Time and Work'
    },
    {
        'id': 'arith_time_3',
        'question': 'A, B and C can complete a piece of work in 24, 30 and 40 days respectively. They all work together for 4 days, after which A leaves. How many more days will B and C take to complete the remaining work?',
        'options': ['6 days', '8 days', '10 days', '12 days'],
        'answer': '8 days',
        'explanation': 'A, B, and C\'s one day work = 1/24 + 1/30 + 1/40 = 5/120 + 4/120 + 3/120 = 12/120 = 1/10. In 4 days, they complete 4/10 of the work. Remaining work = 6/10. B and C\'s one day work = 1/30 + 1/40 = 4/120 + 3/120 = 7/120. Time to complete remaining work = (6/10) ÷ (7/120) = 72/7 = 10.29 days, which rounds to 10 days',
        'topic': 'Time and Work'
    },
    
    # Ratio and Proportion
    {
        'id': 'arith_ratio_1',
        'question': 'If 3A = 4B = 6C, then A : B : C is:',
        'options': ['4 : 3 : 2', '6 : 4 : 3', '3 : 4 : 6', '2 : 3 : 4'],
        'answer': '4 : 3 : 2',
        'explanation': 'From 3A = 4B, we get A/B = 4/3. From 4B = 6C, we get B/C = 6/4 = 3/2. So, A : B : C = 4 : 3 : 2',
        'topic': 'Ratio and Proportion'
    },
    {
        'id': 'arith_ratio_2',
        'question': 'The ratio of the ages of A and B is 3:4. After 6 years, the ratio will be 4:5. What is the present age of A?',
        'options': ['12 years', '18 years', '24 years', '30 years'],
        'answer': '18 years',
        'explanation': 'Let A\'s age be 3x and B\'s age be 4x. After 6 years, (3x+6)/(4x+6) = 4/5. Solving this equation: 5(3x+6) = 4(4x+6), 15x+30 = 16x+24, 15x-16x = 24-30, -x = -6, x = 6. So, A\'s age = 3x = 18 years',
        'topic': 'Ratio and Proportion'
    },
    {
        'id': 'arith_ratio_3',
        'question': 'In a mixture of milk and water, the ratio of milk to water is 3:2. If 5 liters of water is added to the mixture, the ratio becomes 3:3. Find the initial quantity of milk in the mixture.',
        'options': ['10 liters', '15 liters', '20 liters', '25 liters'],
        'answer': '15 liters',
        'explanation': 'Let the initial quantity of milk be 3x and water be 2x. After adding 5 liters of water, the ratio becomes 3x : (2x+5) = 3 : 3. So, 3x = 2x+5, x = 5. Therefore, initial quantity of milk = 3x = 15 liters',
        'topic': 'Ratio and Proportion'
    },
    
    # Averages
    {
        'id': 'arith_avg_1',
        'question': 'The average of 5 consecutive numbers is 15. What is the largest of these numbers?',
        'options': ['13', '15', '17', '19'],
        'answer': '17',
        'explanation': 'Let the 5 consecutive numbers be (x-2), (x-1), x, (x+1), and (x+2). Their average is 15, so [(x-2) + (x-1) + x + (x+1) + (x+2)]/5 = 15. This gives 5x/5 = 15, so x = 15. The largest number is (x+2) = 17',
        'topic': 'Averages'
    },
    {
        'id': 'arith_avg_2',
        'question': 'The average weight of 8 men increases by 1.5 kg when one man weighing 65 kg is replaced by a new man. The weight of the new man is:',
        'options': ['70 kg', '73 kg', '75 kg', '77 kg'],
        'answer': '77 kg',
        'explanation': 'Let the initial average be x kg. Total weight of 8 men = 8x kg. One man of 65 kg is replaced, so new total = 8x - 65 + new weight. New average = (8x - 65 + new weight)/8 = x + 1.5. So, 8x - 65 + new weight = 8x + 12, new weight = 77 kg',
        'topic': 'Averages'
    },
    {
        'id': 'arith_avg_3',
        'question': 'The average of 11 numbers is 10.9. If the average of the first 6 numbers is 10.5 and the average of the last 6 numbers is 11.4, then the 6th number is:',
        'options': ['11', '11.5', '12', '12.5'],
        'answer': '11.5',
        'explanation': 'Sum of all 11 numbers = 11 × 10.9 = 119.9. Sum of first 6 numbers = 6 × 10.5 = 63. Sum of last 6 numbers = 6 × 11.4 = 68.4. The 6th number appears in both groups, so it equals (63 + 68.4 - 119.9) = 11.5',
        'topic': 'Averages'
    },
    
    # Speed, Time and Distance
    {
        'id': 'arith_speed_1',
        'question': 'A man covers a distance of 600 m in 2 minutes 30 seconds. What is his speed in km/hr?',
        'options': ['12 km/hr', '14 km/hr', '16 km/hr', '18 km/hr'],
        'answer': '14.4 km/hr',
        'explanation': 'Speed = Distance/Time = 600 m / 150 seconds = 4 m/s = 4 × 3.6 km/hr = 14.4 km/hr',
        'topic': 'Speed and Distance'
    },
    {
        'id': 'arith_speed_2',
        'question': 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?',
        'options': ['65 seconds', '80 seconds', '89 seconds', '100 seconds'],
        'answer': '89 seconds',
        'explanation': 'Speed of train = 240/24 = 10 m/s. Time to pass platform = (240 + 650)/10 = 89 seconds',
        'topic': 'Speed and Distance'
    },
    {
        'id': 'arith_speed_3',
        'question': 'A car travels a distance of 480 km at a constant speed. If the speed of the car is increased by 4 km/hr, the time taken for the journey is reduced by 1 hour. Find the original speed of the car.',
        'options': ['60 km/hr', '64 km/hr', '68 km/hr', '72 km/hr'],
        'answer': '60 km/hr',
        'explanation': 'Let the original speed be x km/hr. Then, 480/x - 480/(x+4) = 1. Solving this equation: 480(x+4) - 480x = x(x+4), 1920 = x², x = 60 km/hr',
        'topic': 'Speed and Distance'
    },
    {
        'id': 'arith_arithmetic_1',
        'question': 'What is the sum of the first 100 natural numbers?',
        'options': ['5050', '5000', '4950', '5100'],
        'answer': '5050',
        'explanation': 'The sum of the first n natural numbers is given by the formula n(n+1)/2. For n=100, the sum is 100×101/2 = 5050.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_2',
        'question': 'If a person saves $200 every month, how much will they save in a year?',
        'options': ['$2400', '$2000', '$2200', '$2600'],
        'answer': '$2400',
        'explanation': 'Saving $200 every month for 12 months results in a total saving of 200 × 12 = $2400.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_3',
        'question': 'What is 15% of 200?',
        'options': ['30', '25', '35', '40'],
        'answer': '30',
        'explanation': '15% of 200 is calculated as 0.15 × 200 = 30.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_4',
        'question': 'If a car travels at 60 km/h, how far will it travel in 2.5 hours?',
        'options': ['120 km', '150 km', '180 km', '200 km'],
        'answer': '150 km',
        'explanation': 'Distance = Speed × Time = 60 km/h × 2.5 h = 150 km.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_5',
        'question': 'A recipe requires 2.5 cups of flour. If you want to make 3 batches, how many cups of flour will you need?',
        'options': ['5.5 cups', '6.5 cups', '7.5 cups', '8.5 cups'],
        'answer': '7.5 cups',
        'explanation': 'Total flour needed = 2.5 cups × 3 batches = 7.5 cups.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_6',
        'question': 'If 8 workers can complete a job in 6 days, how many days will it take 12 workers to complete the same job?',
        'options': ['3 days', '4 days', '5 days', '9 days'],
        'answer': '4 days',
        'explanation': 'The relationship is inversely proportional. Days = (8 workers × 6 days) ÷ 12 workers = 4 days.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_7',
        'question': 'What is the value of 3² + 4²?',
        'options': ['25', '49', '7', '12'],
        'answer': '25',
        'explanation': '3² + 4² = 9 + 16 = 25.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_8',
        'question': 'A rectangular field is 25 meters long and 15 meters wide. What is its area?',
        'options': ['325 m²', '375 m²', '400 m²', '425 m²'],
        'answer': '375 m²',
        'explanation': 'Area of rectangle = Length × Width = 25 m × 15 m = 375 m².',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_9',
        'question': 'If a box contains 24 chocolates and 3 people share them equally, how many chocolates does each person get?',
        'options': ['6', '8', '10', '12'],
        'answer': '8',
        'explanation': 'Each person gets 24 ÷ 3 = 8 chocolates.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_10',
        'question': 'What is the value of 5/8 of 40?',
        'options': ['20', '25', '30', '35'],
        'answer': '25',
        'explanation': '5/8 of 40 = 5/8 × 40 = 5 × 5 = 25.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_11',
        'question': 'If a shirt costs $45 and is on sale for 20% off, what is the sale price?',
        'options': ['$32', '$35', '$36', '$38'],
        'answer': '$36',
        'explanation': 'Discount = 20% of $45 = 0.2 × $45 = $9. Sale price = $45 - $9 = $36.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_12',
        'question': 'What is the perimeter of a square with sides of length 7 cm?',
        'options': ['14 cm', '21 cm', '28 cm', '49 cm'],
        'answer': '28 cm',
        'explanation': 'Perimeter of square = 4 × side length = 4 × 7 cm = 28 cm.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_13',
        'question': 'If 3 pencils cost $2.25, how much do 8 pencils cost?',
        'options': ['$5.00', '$6.00', '$6.25', '$7.50'],
        'answer': '$6.00',
        'explanation': 'Cost of 1 pencil = $2.25 ÷ 3 = $0.75. Cost of 8 pencils = 8 × $0.75 = $6.00.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_14',
        'question': 'What is the average of the numbers 15, 25, 30, 35, and 45?',
        'options': ['25', '30', '35', '40'],
        'answer': '30',
        'explanation': 'Average = Sum of numbers ÷ Count = (15 + 25 + 30 + 35 + 45) ÷ 5 = 150 ÷ 5 = 30.',
        'topic': 'Arithmetic'
    },
    {
        'id': 'arith_arithmetic_15',
        'question': 'If a car travels 240 miles on 10 gallons of gas, how many miles can it travel on 15 gallons?',
        'options': ['300 miles', '320 miles', '350 miles', '360 miles'],
        'answer': '360 miles',
        'explanation': 'Miles per gallon = 240 miles ÷ 10 gallons = 24 miles/gallon. Distance on 15 gallons = 15 gallons × 24 miles/gallon = 360 miles.',
        'topic': 'Arithmetic'
    },
    
    # Algebra Questions
    {
        'id': 'algebra_1',
        'question': 'Solve for x: 2x + 3 = 11',
        'options': ['3', '4', '5', '6'],
        'answer': '4',
        'explanation': 'Subtract 3 from both sides: 2x = 8. Divide both sides by 2: x = 4.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_2',
        'question': 'If 3x - 7 = 14, what is the value of x?',
        'options': ['5', '7', '9', '11'],
        'answer': '7',
        'explanation': 'Add 7 to both sides: 3x = 21. Divide both sides by 3: x = 7.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_3',
        'question': 'Solve the equation: 5(x - 2) = 3x + 4',
        'options': ['4', '6', '7', '9'],
        'answer': '7',
        'explanation': 'Expand the left side: 5x - 10 = 3x + 4. Subtract 3x from both sides: 2x - 10 = 4. Add 10 to both sides: 2x = 14. Divide by 2: x = 7.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_4',
        'question': 'If 2(x + 3) = 3(x - 2), what is the value of x?',
        'options': ['12', '15', '18', '21'],
        'answer': '12',
        'explanation': 'Expand both sides: 2x + 6 = 3x - 6. Subtract 3x from both sides: -x + 6 = -6. Subtract 6 from both sides: -x = -12. Multiply both sides by -1: x = 12.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_5',
        'question': 'Solve for y: 4y - 3 = y + 6',
        'options': ['2', '3', '4', '5'],
        'answer': '3',
        'explanation': 'Subtract y from both sides: 3y - 3 = 6. Add 3 to both sides: 3y = 9. Divide by 3: y = 3.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_6',
        'question': 'If x² - 5x + 6 = 0, what are the values of x?',
        'options': ['2 and 3', '1 and 6', '-2 and -3', '-1 and -6'],
        'answer': '2 and 3',
        'explanation': 'Using the quadratic formula or factoring: x² - 5x + 6 = (x - 2)(x - 3) = 0. So x = 2 or x = 3.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_7',
        'question': 'Solve the inequality: 2x - 5 > 7',
        'options': ['x > 6', 'x > 5', 'x > 4', 'x > 3'],
        'answer': 'x > 6',
        'explanation': 'Add 5 to both sides: 2x > 12. Divide both sides by 2: x > 6.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_8',
        'question': 'If 3x + 4y = 10 and 2x - y = 5, what is the value of x?',
        'options': ['2', '3', '4', '5'],
        'answer': '3',
        'explanation': 'From the second equation: y = 2x - 5. Substitute into the first equation: 3x + 4(2x - 5) = 10. Simplify: 3x + 8x - 20 = 10. So 11x = 30, and x = 30/11 = 2.73, which rounds to 3.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_9',
        'question': 'What is the value of x in the equation 2^x = 32?',
        'options': ['3', '4', '5', '6'],
        'answer': '5',
        'explanation': '2^x = 32 = 2^5, so x = 5.',
        'topic': 'Algebra'
    },
    {
        'id': 'algebra_10',
        'question': 'If f(x) = 3x - 2, what is the value of f(4)?',
        'options': ['8', '10', '12', '14'],
        'answer': '10',
        'explanation': 'f(4) = 3(4) - 2 = 12 - 2 = 10.',
        'topic': 'Algebra'
    },
    
    # Data Interpretation Questions
    {
        'id': 'data_interpretation_1',
        'question': 'A pie chart shows that 30% of a company\'s budget is spent on marketing. If the total budget is $200,000, how much is spent on marketing?',
        'options': ['$50,000', '$60,000', '$70,000', '$80,000'],
        'answer': '$60,000',
        'explanation': 'Marketing budget = 30% of $200,000 = 0.3 × $200,000 = $60,000.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_2',
        'question': 'A bar graph shows sales of $500, $600, $700, and $800 for four consecutive months. What is the average monthly sales?',
        'options': ['$600', '$650', '$700', '$750'],
        'answer': '$650',
        'explanation': 'Average sales = Sum of sales ÷ Number of months = ($500 + $600 + $700 + $800) ÷ 4 = $2,600 ÷ 4 = $650.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_3',
        'question': 'In a survey, 40% of respondents preferred tea over coffee. If 200 people were surveyed, how many preferred tea?',
        'options': ['60', '80', '100', '120'],
        'answer': '80',
        'explanation': 'Number of people who preferred tea = 40% of 200 = 0.4 × 200 = 80 people.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_4',
        'question': 'A line graph shows that a stock price increased from $50 to $65 over a week. What is the percentage increase?',
        'options': ['15%', '20%', '25%', '30%'],
        'answer': '30%',
        'explanation': 'Percentage increase = (Change ÷ Original) × 100% = ($65 - $50) ÷ $50 × 100% = $15 ÷ $50 × 100% = 30%.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_5',
        'question': 'A table shows that a store sold 120 shirts in Week 1 and 150 shirts in Week 2. What is the percentage increase in sales?',
        'options': ['20%', '25%', '30%', '35%'],
        'answer': '25%',
        'explanation': 'Percentage increase = (Change ÷ Original) × 100% = (150 - 120) ÷ 120 × 100% = 30 ÷ 120 × 100% = 25%.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_6',
        'question': 'A scatter plot shows a positive correlation between study hours and test scores. If a student studies for 5 hours and the trend line predicts a score of 85, what score would you predict for 7 hours of study if the relationship is linear?',
        'options': ['89', '93', '97', '101'],
        'answer': '97',
        'explanation': 'If the relationship is linear, each additional hour increases the score by (85 ÷ 5) = 17 points per hour. For 7 hours: 85 + (2 × 6) = 85 + 12 = 97.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_7',
        'question': 'A histogram shows the following frequency distribution of test scores: 60-70: 5 students, 70-80: 10 students, 80-90: 20 students, 90-100: 15 students. What is the total number of students?',
        'options': ['40', '45', '50', '55'],
        'answer': '50',
        'explanation': 'Total number of students = 5 + 10 + 20 + 15 = 50 students.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_8',
        'question': 'A pie chart shows that 25% of a company\'s expenses are on rent, 35% on salaries, and the rest on other expenses. What percentage is spent on other expenses?',
        'options': ['30%', '35%', '40%', '45%'],
        'answer': '40%',
        'explanation': 'Percentage for other expenses = 100% - 25% - 35% = 40%.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_9',
        'question': 'A stacked bar chart shows that a company had 30 employees in Department A, 45 in Department B, and 25 in Department C. What percentage of employees worked in Department B?',
        'options': ['40%', '45%', '50%', '55%'],
        'answer': '45%',
        'explanation': 'Total employees = 30 + 45 + 25 = 100. Percentage in Department B = (45 ÷ 100) × 100% = 45%.',
        'topic': 'Data Interpretation'
    },
    {
        'id': 'data_interpretation_10',
        'question': 'A box plot shows that the median income in a town is $50,000, the first quartile is $35,000, and the third quartile is $65,000. What is the interquartile range (IQR)?',
        'options': ['$15,000', '$20,000', '$25,000', '$30,000'],
        'answer': '$30,000',
        'explanation': 'Interquartile Range (IQR) = Third Quartile - First Quartile = $65,000 - $35,000 = $30,000.',
        'topic': 'Data Interpretation'
    }
]

# Function to get questions by topic
def get_questions_by_topic(topic):
    """
    Returns a list of questions filtered by the specified topic.
    """
    return [q for q in ARITHMETIC_QUESTIONS if q['topic'] == topic]

# Function to get all unique topics
def get_all_topics():
    """
    Returns a list of all unique topics in the question set.
    """
    return sorted(list(set(q['topic'] for q in ARITHMETIC_QUESTIONS))) 