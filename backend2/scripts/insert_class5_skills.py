"""
Script to insert Class V maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class5_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class V maths skills data
    skills_data = [
        # Place values and number sense
        (5, "Place values and number sense", "Place values"),
        (5, "Place values and number sense", "Convert between place values"),
        (5, "Place values and number sense", "Compare numbers"),
        (5, "Place values and number sense", "Word names for numbers"),
        (5, "Place values and number sense", "Rounding"),
        (5, "Place values and number sense", "Even or odd: arithmetic rules"),

        # Addition and subtraction
        (5, "Addition and subtraction", "Add and subtract whole numbers"),
        (5, "Addition and subtraction", "Add and subtract whole numbers: word problems"),
        (5, "Addition and subtraction", "Complete addition and subtraction sentences"),
        (5, "Addition and subtraction", "Fill in the missing digits"),
        (5, "Addition and subtraction", "Choose numbers with a particular sum or difference"),
        (5, "Addition and subtraction", "Properties of addition"),
        (5, "Addition and subtraction", "Estimate sums and differences of whole numbers"),
        (5, "Addition and subtraction", "Estimate sums and differences: word problems"),

        # Multiplication
        (5, "Multiplication", "Multiply by one-digit numbers"),
        (5, "Multiplication", "Multiply by one-digit numbers: word problems"),
        (5, "Multiplication", "Multiplication patterns over increasing place values"),
        (5, "Multiplication", "Multiply numbers ending in zeroes"),
        (5, "Multiplication", "Multiply numbers ending in zeroes: word problems"),
        (5, "Multiplication", "Properties of multiplication"),
        (5, "Multiplication", "Choose numbers with a particular product"),
        (5, "Multiplication", "Estimate products"),
        (5, "Multiplication", "Estimate products: word problems"),
        (5, "Multiplication", "Box multiplication"),
        (5, "Multiplication", "Lattice multiplication"),
        (5, "Multiplication", "Multiply by 2-digit numbers: complete the missing steps"),
        (5, "Multiplication", "Multiply 2-digit numbers by 2-digit numbers"),
        (5, "Multiplication", "Multiply 2-digit numbers by 3-digit numbers"),
        (5, "Multiplication", "Multiply 2-digit numbers by larger numbers"),
        (5, "Multiplication", "Multiply by 2-digit numbers: word problems"),
        (5, "Multiplication", "Multiply three or four numbers"),
        (5, "Multiplication", "Multiply three or four numbers: word problems"),

        # Division
        (5, "Division", "Division facts to 12"),
        (5, "Division", "Division facts to 12: word problems"),
        (5, "Division", "Divisibility rules"),
        (5, "Division", "Divisibility rules: word problems"),
        (5, "Division", "Divide by one-digit numbers"),
        (5, "Division", "Divide by one-digit numbers: word problems"),
        (5, "Division", "Divide by one-digit numbers: interpret remainders"),
        (5, "Division", "Estimate quotients: word problems"),
        (5, "Division", "Division patterns over increasing place values"),
        (5, "Division", "Divide numbers ending in zeroes"),
        (5, "Division", "Divide numbers ending in zeroes: word problems"),
        (5, "Division", "Divide by two-digit numbers"),
        (5, "Division", "Divide by two-digit numbers: word problems"),
        (5, "Division", "Choose numbers with a particular quotient"),

        # Decimals
        (5, "Decimals", "What decimal number is illustrated?"),
        (5, "Decimals", "Model decimals and fractions"),
        (5, "Decimals", "Understanding decimals expressed in words"),
        (5, "Decimals", "Place values in decimal numbers"),
        (5, "Decimals", "Equivalent decimals"),
        (5, "Decimals", "Round decimals"),
        (5, "Decimals", "Decimal number lines"),
        (5, "Decimals", "Compare decimals on number lines"),
        (5, "Decimals", "Compare decimal numbers"),
        (5, "Decimals", "Put decimal numbers in order"),
        (5, "Decimals", "Convert fractions to decimals"),
        (5, "Decimals", "Convert decimals to fractions"),

        # Fractions
        (5, "Fractions", "Fractions review"),
        (5, "Fractions", "Unit fractions: modelling word problems"),
        (5, "Fractions", "Unit fractions: word problems"),
        (5, "Fractions", "Fractions of a whole: modelling word problems"),
        (5, "Fractions", "Fractions of a whole: word problems"),
        (5, "Fractions", "Fractions of a group: word problems"),
        (5, "Fractions", "Equivalent fractions"),
        (5, "Fractions", "Patterns of equivalent fractions"),
        (5, "Fractions", "Write fractions in lowest terms"),
        (5, "Fractions", "Compare fractions"),
        (5, "Fractions", "Put fractions in order"),
        (5, "Fractions", "Fractions of a number"),
        (5, "Fractions", "Fractions of a number: word problems"),
        (5, "Fractions", "Mixed numbers"),

        # Mixed operations
        (5, "Mixed operations", "Add, subtract, multiply and divide whole numbers"),
        (5, "Mixed operations", "Add, subtract, multiply and divide whole numbers: word problems"),

        # Problem solving
        (5, "Problem solving", "Multi-step word problems"),
        (5, "Problem solving", "Word problems with extra or missing information"),
        (5, "Problem solving", "Guess-and-check problems"),
        (5, "Problem solving", "Find the order"),
        (5, "Problem solving", "Use Venn diagrams to solve problems"),

        # Money
        (5, "Money", "Add and subtract money amounts"),
        (5, "Money", "Add and subtract money: word problems"),
        (5, "Money", "Multiply money amounts: word problems"),
        (5, "Money", "Divide money amounts: word problems"),
        (5, "Money", "Price lists"),
        (5, "Money", "Unit prices"),

        # Number sequences
        (5, "Number sequences", "Complete an increasing number sequence"),
        (5, "Number sequences", "Complete a geometric number sequence"),
        (5, "Number sequences", "Use a rule to complete a number sequence"),
        (5, "Number sequences", "Number sequences: word problems"),
        (5, "Number sequences", "Number sequences: mixed review"),

        # Data and graphs
        (5, "Data and graphs", "Read a table"),
        (5, "Data and graphs", "Interpret line graphs"),
        (5, "Data and graphs", "Create line graphs"),
        (5, "Data and graphs", "Interpret bar graphs"),
        (5, "Data and graphs", "Create bar graphs"),
        (5, "Data and graphs", "Interpret pictographs"),
        (5, "Data and graphs", "Create pictographs"),
        (5, "Data and graphs", "Interpret histograms"),
        (5, "Data and graphs", "Create histograms"),
        (5, "Data and graphs", "Interpret line plots"),
        (5, "Data and graphs", "Create line plots"),
        (5, "Data and graphs", "Frequency tables"),
        (5, "Data and graphs", "Interpret stem-and-leaf plots"),
        (5, "Data and graphs", "Create stem-and-leaf plots"),
        (5, "Data and graphs", "Choose the best type of graph"),

        # Probability
        (5, "Probability", "Understanding probability"),
        (5, "Probability", "Find the probability"),
        (5, "Probability", "Make predictions"),
        (5, "Probability", "Combinations"),

        # Time
        (5, "Time", "Convert time units"),
        (5, "Time", "Add and subtract mixed time units"),
        (5, "Time", "Elapsed time"),
        (5, "Time", "Find start and end times: word problems"),
        (5, "Time", "Convert between 12-hour and 24-hour time"),
        (5, "Time", "Schedules and timelines - 12-hour time"),
        (5, "Time", "Schedules - 24-hour time"),
        (5, "Time", "Time patterns"),

        # Units of measurement
        (5, "Units of measurement", "Choose the appropriate metric unit of measure"),
        (5, "Units of measurement", "Compare and convert metric units of length"),
        (5, "Units of measurement", "Compare and convert metric units of mass"),
        (5, "Units of measurement", "Compare and convert metric units of volume"),
        (5, "Units of measurement", "Choose the more reasonable temperature"),
        (5, "Units of measurement", "Metric mixed units"),

        # Geometry
        (5, "Geometry", "Which figure is being described?"),
        (5, "Geometry", "Number of sides in polygons"),
        (5, "Geometry", "Regular and irregular polygons"),
        (5, "Geometry", "Types of angles"),
        (5, "Geometry", "Measure angles with a protractor"),
        (5, "Geometry", "Lines of symmetry"),
        (5, "Geometry", "Rotational symmetry"),
        (5, "Geometry", "Reflection, rotation and translation"),
        (5, "Geometry", "Identify three-dimensional figures"),
        (5, "Geometry", "Count vertices, edges and faces"),
        (5, "Geometry", "Nets of three-dimensional figures"),
        (5, "Geometry", "Three-dimensional figures viewed from different perspectives"),

        # Geometric measurement
        (5, "Geometric measurement", "Perimeter"),
        (5, "Geometric measurement", "Perimeter: find the missing side lengths"),
        (5, "Geometric measurement", "Area of squares and rectangles"),
        (5, "Geometric measurement", "Area and perimeter of figures on grids"),
        (5, "Geometric measurement", "Area and perimeter: word problems"),
        (5, "Geometric measurement", "Use area and perimeter to determine cost"),
        (5, "Geometric measurement", "Volume of figures made of unit cubes"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class V maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class5_skills()
