"""
Script to insert Class III maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class3_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class III maths skills data
    skills_data = [
        # Numbers and comparing
        (3, "Numbers and comparing", "Even or odd"),
        (3, "Numbers and comparing", "Even or odd: arithmetic rules"),
        (3, "Numbers and comparing", "Skip-counting puzzles"),
        (3, "Numbers and comparing", "Number sequences"),
        (3, "Numbers and comparing", "Ordinal numbers to 100th"),
        (3, "Numbers and comparing", "Write numbers in words"),
        (3, "Numbers and comparing", "Comparing numbers"),
        (3, "Numbers and comparing", "Which number is greatest/least?"),
        (3, "Numbers and comparing", "Put numbers in order"),

        # Place values
        (3, "Place values", "Place value models up to hundreds"),
        (3, "Place values", "Place value names up to hundreds"),
        (3, "Place values", "Place value names up to thousands"),
        (3, "Place values", "Value of a digit"),
        (3, "Place values", "Convert to/from a number"),
        (3, "Place values", "Convert between place values"),
        (3, "Place values", "Convert from expanded form"),
        (3, "Place values", "Convert between standard and expanded form"),
        (3, "Place values", "Place value word problems"),

        # Addition
        (3, "Addition", "Add two numbers up to three digits"),
        (3, "Addition", "Addition input/output tables - up to three digits"),
        (3, "Addition", "Add two numbers up to three digits - word problems"),
        (3, "Addition", "Complete the addition sentence - up to three digits"),
        (3, "Addition", "Balance addition equations - up to three digits"),
        (3, "Addition", "Add three or more numbers up to three digits each"),
        (3, "Addition", "Add three or more numbers up to three digits - word problems"),
        (3, "Addition", "Addition patterns over increasing place values"),
        (3, "Addition", "Addition: fill in the missing digits"),

        # Subtraction
        (3, "Subtraction", "Subtract numbers up to three digits"),
        (3, "Subtraction", "Subtraction input/output tables - up to three digits"),
        (3, "Subtraction", "Subtract numbers up to three digits - word problems"),
        (3, "Subtraction", "Complete the subtraction sentence - up to three digits"),
        (3, "Subtraction", "Balance subtraction equations - up to three digits"),
        (3, "Subtraction", "Subtraction patterns over increasing place values"),
        (3, "Subtraction", "Subtraction: fill in the missing digits"),

        # Understand multiplication
        (3, "Understand multiplication", "Count equal groups"),
        (3, "Understand multiplication", "Identify multiplication expressions for equal groups"),
        (3, "Understand multiplication", "Write multiplication sentences for equal groups"),
        (3, "Understand multiplication", "Relate addition and multiplication for equal groups"),
        (3, "Understand multiplication", "Identify multiplication expressions for arrays"),
        (3, "Understand multiplication", "Write multiplication sentences for arrays"),
        (3, "Understand multiplication", "Make arrays to model multiplication"),
        (3, "Understand multiplication", "Write multiplication sentences for number lines"),

        # Multiplication skill builders
        (3, "Multiplication skill builders", "Multiply by 0"),
        (3, "Multiplication skill builders", "Multiply by 1"),
        (3, "Multiplication skill builders", "Multiply by 2"),
        (3, "Multiplication skill builders", "Multiply by 3"),
        (3, "Multiplication skill builders", "Multiply by 4"),
        (3, "Multiplication skill builders", "Multiply by 5"),
        (3, "Multiplication skill builders", "Multiply by 6"),
        (3, "Multiplication skill builders", "Multiply by 7"),
        (3, "Multiplication skill builders", "Multiply by 8"),
        (3, "Multiplication skill builders", "Multiply by 9"),
        (3, "Multiplication skill builders", "Multiply by 10"),

        # Multiplication fluency
        (3, "Multiplication fluency", "Multiplication facts for 2, 3, 4, 5 and 10"),
        (3, "Multiplication fluency", "Multiplication facts for 2, 3, 4, 5, 10: true or false?"),
        (3, "Multiplication fluency", "Multiplication facts for 2, 3, 4, 5, 10: sorting"),
        (3, "Multiplication fluency", "Multiplication facts for 6, 7, 8 and 9"),
        (3, "Multiplication fluency", "Multiplication facts for 6, 7, 8, 9: true or false?"),
        (3, "Multiplication fluency", "Multiplication facts for 6, 7, 8, 9: sorting"),
        (3, "Multiplication fluency", "Multiplication facts up to 10"),
        (3, "Multiplication fluency", "Multiplication facts up to 10: true or false?"),
        (3, "Multiplication fluency", "Multiplication facts up to 10: sorting"),
        (3, "Multiplication fluency", "Multiplication sentences up to 10: true or false?"),
        (3, "Multiplication fluency", "Multiplication facts up to 10: find the missing factor"),
        (3, "Multiplication fluency", "Multiplication facts up to 10: select the missing factors"),
        (3, "Multiplication fluency", "Squares up to 10 x 10"),

        # Multiplication
        (3, "Multiplication", "Multiplication sentences"),
        (3, "Multiplication", "Multiply numbers ending in zeroes"),
        (3, "Multiplication", "Multiplication input/output tables"),
        (3, "Multiplication", "Multiplication word problems"),
        (3, "Multiplication", "Multiplication word problems: find the missing factor"),
        (3, "Multiplication", "Multiply one-digit numbers by two-digit numbers"),
        (3, "Multiplication", "Multiply one-digit numbers by two-digit numbers: word problems"),
        (3, "Multiplication", "Multiply one-digit numbers by three-digit numbers"),
        (3, "Multiplication", "Multiply one-digit numbers by three-digit numbers: word problems"),
        (3, "Multiplication", "Box multiplication"),
        (3, "Multiplication", "Lattice multiplication"),

        # Understand division
        (3, "Understand division", "Divide by counting equal groups"),
        (3, "Understand division", "Write division sentences for groups"),
        (3, "Understand division", "Relate multiplication and division for groups"),
        (3, "Understand division", "Write division sentences for arrays"),
        (3, "Understand division", "Relate multiplication and division for arrays"),

        # Division skill builders
        (3, "Division skill builders", "Divide by 1"),
        (3, "Division skill builders", "Divide by 2"),
        (3, "Division skill builders", "Divide by 3"),
        (3, "Division skill builders", "Divide by 4"),
        (3, "Division skill builders", "Divide by 5"),
        (3, "Division skill builders", "Divide by 6"),
        (3, "Division skill builders", "Divide by 7"),
        (3, "Division skill builders", "Divide by 8"),
        (3, "Division skill builders", "Divide by 9"),
        (3, "Division skill builders", "Divide by 10"),

        # Division fluency
        (3, "Division fluency", "Division facts for 2, 3, 4, 5, 10"),
        (3, "Division fluency", "Division facts for 2, 3, 4, 5, 10: true or false?"),
        (3, "Division fluency", "Division facts for 2, 3, 4, 5, 10: sorting"),
        (3, "Division fluency", "Division facts for 6, 7, 8, 9"),
        (3, "Division fluency", "Division facts for 6, 7, 8, 9: true or false?"),
        (3, "Division fluency", "Division facts for 6, 7, 8, 9: sorting"),
        (3, "Division fluency", "Division facts up to 10"),
        (3, "Division fluency", "Division facts up to 10: true or false?"),
        (3, "Division fluency", "Division facts up to 10: sorting"),
        (3, "Division fluency", "Division facts up to 10: find the missing number"),
        (3, "Division fluency", "Division sentences up to 10: true or false?"),

        # Division
        (3, "Division", "Complete the division table"),
        (3, "Division", "Division input/output tables"),
        (3, "Division", "Division word problems"),
        (3, "Division", "Divisibility rules for 2, 5 and 10"),

        # Data and graphs
        (3, "Data and graphs", "Interpret line plots"),
        (3, "Data and graphs", "Create line plots"),
        (3, "Data and graphs", "Interpret pictographs"),
        (3, "Data and graphs", "Create pictographs"),
        (3, "Data and graphs", "Sort shapes into a Venn diagram"),
        (3, "Data and graphs", "Count shapes in a Venn diagram"),

        # Money
        (3, "Money", "Count coins and notes - up to 500-rupee note"),
        (3, "Money", "Which picture shows more?"),
        (3, "Money", "Purchases - do you have enough money - up to 1,000 rupees"),
        (3, "Money", "Making change"),
        (3, "Money", "Inequalities with money"),
        (3, "Money", "Put money amounts in order"),
        (3, "Money", "Add and subtract money amounts"),
        (3, "Money", "Add money amounts - word problems"),
        (3, "Money", "Price lists"),

        # Time
        (3, "Time", "Match analogue clocks and times"),
        (3, "Time", "Match digital clocks and times"),
        (3, "Time", "Read clocks and write times"),
        (3, "Time", "A.M. or P.M."),
        (3, "Time", "Elapsed time"),
        (3, "Time", "Elapsed time word problems"),
        (3, "Time", "Time patterns"),
        (3, "Time", "Read a calendar"),
        (3, "Time", "Reading schedules"),
        (3, "Time", "Timelines"),

        # Measurement
        (3, "Measurement", "Measure using a centimetre ruler"),
        (3, "Measurement", "Which metric unit of length is appropriate?"),
        (3, "Measurement", "Compare and convert metric units of length"),
        (3, "Measurement", "Conversion tables"),
        (3, "Measurement", "Metric mixed units"),
        (3, "Measurement", "Light and heavy"),
        (3, "Measurement", "Holds more or less"),
        (3, "Measurement", "Compare weight and capacity"),
        (3, "Measurement", "Read a thermometer"),
        (3, "Measurement", "Reasonable temperature"),

        # Geometry
        (3, "Geometry", "Identify two-dimensional shapes"),
        (3, "Geometry", "Count and compare sides and vertices"),
        (3, "Geometry", "Identify three-dimensional shapes"),
        (3, "Geometry", "Count vertices, edges and faces"),
        (3, "Geometry", "Identify faces of three-dimensional shapes"),
        (3, "Geometry", "Is it a polygon?"),
        (3, "Geometry", "Reflection, rotation and translation"),
        (3, "Geometry", "Symmetry"),
        (3, "Geometry", "Maps"),
        (3, "Geometry", "Find the area of rectangles and squares"),
        (3, "Geometry", "Find the missing side length of a rectangle"),

        # Properties
        (3, "Properties", "Addition, subtraction, multiplication and division terms"),
        (3, "Properties", "Understanding parentheses"),
        (3, "Properties", "Properties of addition"),
        (3, "Properties", "Solve using properties of addition"),
        (3, "Properties", "Properties of multiplication"),
        (3, "Properties", "Solve using properties of multiplication"),
        (3, "Properties", "Distributive property: find the missing factor"),
        (3, "Properties", "Multiply using the distributive property"),
        (3, "Properties", "Relate addition and multiplication"),
        (3, "Properties", "Relate multiplication and division"),

        # Mixed operations
        (3, "Mixed operations", "Addition, subtraction, multiplication and division facts"),
        (3, "Mixed operations", "Complete the addition, subtraction, multiplication or division sentence"),
        (3, "Mixed operations", "Multiplication and division facts up to 5: true or false?"),
        (3, "Mixed operations", "Multiplication and division facts up to 10: true or false?"),
        (3, "Mixed operations", "Multiplication and division facts up to 12: true or false?"),
        (3, "Mixed operations", "Multiplication and division sentences up to 12: true or false?"),
        (3, "Mixed operations", "Add, subtract, multiply and divide"),
        (3, "Mixed operations", "Addition, subtraction, multiplication and division word problems"),
        (3, "Mixed operations", "Add and subtract data from tables"),
        (3, "Mixed operations", "Multi-step word problems"),
        (3, "Mixed operations", "Numerical operations: find the missing sign"),

        # Estimation and rounding
        (3, "Estimation and rounding", "Rounding"),
        (3, "Estimation and rounding", "Round money amounts"),
        (3, "Estimation and rounding", "Rounding puzzles"),
        (3, "Estimation and rounding", "Estimate sums"),
        (3, "Estimation and rounding", "Estimate sums: word problems"),
        (3, "Estimation and rounding", "Estimate differences"),
        (3, "Estimation and rounding", "Estimate differences: word problems"),
        (3, "Estimation and rounding", "Estimate products"),
        (3, "Estimation and rounding", "Estimate products: word problems"),
        (3, "Estimation and rounding", "Estimate sums, differences and products: word problems"),

        # Logical reasoning
        (3, "Logical reasoning", "Guess the number"),
        (3, "Logical reasoning", "Largest/smallest number possible"),
        (3, "Logical reasoning", "Find the order"),
        (3, "Logical reasoning", "Age puzzles"),
        (3, "Logical reasoning", "Find two numbers based on sum and difference"),
        (3, "Logical reasoning", "Find two numbers based on sum, difference, product and quotient"),
        
        # Patterns
        (3, "Patterns", "Repeating patterns"),
        (3, "Patterns", "Growing patterns"),
        (3, "Patterns", "Find the next shape in a pattern"),
        (3, "Patterns", "Complete a repeating pattern"),
        (3, "Patterns", "Make a repeating pattern"),
        (3, "Patterns", "Find the next row in a growing pattern"),

        # Probability
        (3, "Probability", "More, less and equally likely"),
        (3, "Probability", "Certain, probable, unlikely and impossible"),
        (3, "Probability", "Combinations"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class III maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class3_skills()
