"""
Script to insert Class IV maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class4_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class IV maths skills data
    skills_data = [
        # Number sense
        (4, "Number sense", "Place values"),
        (4, "Number sense", "Convert between place values"),
        (4, "Number sense", "Word names for numbers"),
        (4, "Number sense", "Ordinal numbers to 100th"),
        (4, "Number sense", "Rounding"),
        (4, "Number sense", "Even or odd: arithmetic rules"),
        (4, "Number sense", "Inequalities with number lines"),
        (4, "Number sense", "Compare numbers up to five digits"),

        # Addition
        (4, "Addition", "Add numbers up to five digits"),
        (4, "Addition", "Add numbers up to five digits: word problems"),
        (4, "Addition", "Addition: fill in the missing digits"),
        (4, "Addition", "Properties of addition"),
        (4, "Addition", "Add three or more numbers up to five digits each"),
        (4, "Addition", "Addition patterns over increasing place values"),
        (4, "Addition", "Choose numbers with a particular sum"),
        (4, "Addition", "Estimate sums"),
        (4, "Addition", "Estimate sums: word problems"),

        # Subtraction
        (4, "Subtraction", "Subtract numbers up to five digits"),
        (4, "Subtraction", "Subtract numbers up to five digits: word problems"),
        (4, "Subtraction", "Subtraction: fill in the missing digits"),
        (4, "Subtraction", "Subtraction patterns over increasing place values"),
        (4, "Subtraction", "Choose numbers with a particular difference"),
        (4, "Subtraction", "Estimate differences"),
        (4, "Subtraction", "Estimate differences: word problems"),

        # Multiplication
        (4, "Multiplication", "Multiplication facts to 10"),
        (4, "Multiplication", "Multiplication facts up to 10: find the missing factor"),
        (4, "Multiplication", "Compare numbers using multiplication"),
        (4, "Multiplication", "Multiply 1-digit numbers by 2-digit numbers"),
        (4, "Multiplication", "Multiply 1-digit numbers by 3-digit or 4-digit numbers"),
        (4, "Multiplication", "Multiply 1-digit numbers by larger numbers"),
        (4, "Multiplication", "Multiplication patterns over increasing place values"),
        (4, "Multiplication", "Properties of multiplication"),
        (4, "Multiplication", "Estimate products - multiply by 1-digit numbers"),
        (4, "Multiplication", "Estimate products - multiply by larger numbers"),
        (4, "Multiplication", "Estimate products: word problems"),
        (4, "Multiplication", "Box multiplication"),
        (4, "Multiplication", "Lattice multiplication"),
        (4, "Multiplication", "Multiply a two-digit number by a two-digit number: complete the missing steps"),
        (4, "Multiplication", "Multiply a two-digit number by a two-digit number"),
        (4, "Multiplication", "Multiply a two-digit number by a two-digit number: word problems"),
        (4, "Multiplication", "Choose numbers with a particular product"),
        (4, "Multiplication", "Multiply a two-digit number by a three-digit number: complete the missing steps"),
        (4, "Multiplication", "Multiply a two-digit number by a three-digit number"),
        (4, "Multiplication", "Multiply a two-digit number by a three-digit number: word problems"),
        (4, "Multiplication", "Multiply numbers ending in zeroes"),
        (4, "Multiplication", "Multiply numbers ending in zeroes: word problems"),
        (4, "Multiplication", "Multiply three numbers"),

        # Division
        (4, "Division", "Division facts to 10"),
        (4, "Division", "Division facts to 10: word problems"),
        (4, "Division", "Properties of division"),
        (4, "Division", "Divide larger numbers"),
        (4, "Division", "Divide larger numbers: word problems"),
        (4, "Division", "Complete the division table"),
        (4, "Division", "Interpret remainders"),
        (4, "Division", "Choose numbers with a particular quotient"),
        (4, "Division", "Divide numbers ending in zeroes"),
        (4, "Division", "Estimate quotients: word problems"),
        (4, "Division", "Divisibility rules"),
        (4, "Division", "Divisibility rules: word problems"),
        (4, "Division", "Division patterns over increasing place values"),

        # Mixed operations
        (4, "Mixed operations", "Add, subtract, multiply and divide"),
        (4, "Mixed operations", "Addition, subtraction, multiplication and division word problems"),
        (4, "Mixed operations", "Estimate sums, differences, products and quotients: word problems"),
        (4, "Mixed operations", "Multi-step word problems"),
        (4, "Mixed operations", "Word problems with extra or missing information"),
        (4, "Mixed operations", "Solve word problems using guess-and-check"),
        (4, "Mixed operations", "Choose numbers with a particular sum, difference, product or quotient"),
        (4, "Mixed operations", "Mentally add and subtract numbers ending in zeroes"),

        # Logical reasoning
        (4, "Logical reasoning", "Find two numbers based on sum and difference"),
        (4, "Logical reasoning", "Find two numbers based on sum, difference, product and quotient"),
        (4, "Logical reasoning", "Find the order"),

        # Data and graphs
        (4, "Data and graphs", "Read a table"),
        (4, "Data and graphs", "Interpret bar graphs"),
        (4, "Data and graphs", "Create bar graphs"),
        (4, "Data and graphs", "Interpret line plots"),
        (4, "Data and graphs", "Create line plots"),
        (4, "Data and graphs", "Frequency tables"),
        (4, "Data and graphs", "Interpret stem-and-leaf plots"),
        (4, "Data and graphs", "Create stem-and-leaf plots"),
        (4, "Data and graphs", "Choose the best type of graph"),

        # Patterns and sequences
        (4, "Patterns and sequences", "Complete an increasing number pattern"),
        (4, "Patterns and sequences", "Complete a geometric number pattern"),
        (4, "Patterns and sequences", "Number patterns: word problems"),
        (4, "Patterns and sequences", "Number patterns: mixed review"),

        # Money
        (4, "Money", "Compare money amounts"),
        (4, "Money", "Round money amounts"),
        (4, "Money", "Add and subtract money amounts"),
        (4, "Money", "Add, subtract, multiply and divide money amounts"),
        (4, "Money", "Making change"),
        (4, "Money", "Price lists"),
        (4, "Money", "Price lists with multiplication"),
        (4, "Money", "Unit prices"),

        # Units of measurement
        (4, "Units of measurement", "Choose the appropriate metric unit of measure"),
        (4, "Units of measurement", "Compare and convert metric units of length"),
        (4, "Units of measurement", "Compare and convert metric units of mass"),
        (4, "Units of measurement", "Compare and convert metric units of volume"),
        (4, "Units of measurement", "Metric mixed units"),

        # Time
        (4, "Time", "Convert time units"),
        (4, "Time", "Add and subtract mixed time units"),
        (4, "Time", "A.M. or P.M."),
        (4, "Time", "Elapsed time"),
        (4, "Time", "Find start and end times: multi-step word problems"),
        (4, "Time", "Convert between 12-hour and 24-hour time"),
        (4, "Time", "Transportation schedules - 12-hour time"),
        (4, "Time", "Transportation schedules - 24-hour time"),
        (4, "Time", "Time patterns"),

        # Geometry
        (4, "Geometry", "Which two-dimensional figure is being described?"),
        (4, "Geometry", "Identify three-dimensional figures"),
        (4, "Geometry", "Count vertices, edges and faces"),
        (4, "Geometry", "Identify faces of three-dimensional figures"),
        (4, "Geometry", "Which three-dimensional figure is being described?"),
        (4, "Geometry", "Nets of three-dimensional figures"),
        (4, "Geometry", "Number of sides in polygons"),
        (4, "Geometry", "Identify lines of symmetry"),
        (4, "Geometry", "Rotational symmetry"),

        # Geometric measurement
        (4, "Geometric measurement", "Perimeter of rectangles"),
        (4, "Geometric measurement", "Perimeter of polygons"),
        (4, "Geometric measurement", "Perimeter of rectilinear shapes"),
        (4, "Geometric measurement", "Perimeter: find the missing side length"),
        (4, "Geometric measurement", "Use perimeter to determine cost"),
        (4, "Geometric measurement", "Find the area of figures made of unit squares"),
        (4, "Geometric measurement", "Select figures with a given area"),
        (4, "Geometric measurement", "Select two figures with the same area"),
        (4, "Geometric measurement", "Create figures with a given area"),
        (4, "Geometric measurement", "Find the area or missing side length of a rectangle"),
        (4, "Geometric measurement", "Area and perimeter: word problems"),

        # Fractions
        (4, "Fractions", "Halves and quarters"),
        (4, "Fractions", "Equal parts"),
        (4, "Fractions", "Simple fractions: what fraction does the shape show?"),
        (4, "Fractions", "Simple fractions: which shape matches the fraction?"),
        (4, "Fractions", "Simple fractions: parts of a group"),

        # Probability
        (4, "Probability", "Understanding probability"),
        (4, "Probability", "Find the probability"),
        (4, "Probability", "Make predictions"),
        (4, "Probability", "Combinations"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class IV maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class4_skills()
