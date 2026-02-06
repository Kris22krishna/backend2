"""
Script to insert Class VI maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class6_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class VI maths skills data
    skills_data = [
        # Whole numbers
        (6, "Whole numbers", "Place values in whole numbers"),
        (6, "Whole numbers", "Word names for numbers"),
        (6, "Whole numbers", "Roman numerals"),
        (6, "Whole numbers", "Add and subtract whole numbers"),
        (6, "Whole numbers", "Add and subtract whole numbers: word problems"),

        # Multiplication
        (6, "Multiplication", "Multiply whole numbers"),
        (6, "Multiplication", "Multiply whole numbers: word problems"),
        (6, "Multiplication", "Multiply numbers ending in zeroes"),
        (6, "Multiplication", "Multiply numbers ending in zeroes: word problems"),
        (6, "Multiplication", "Multiply three or more numbers"),
        (6, "Multiplication", "Multiply three or more numbers: word problems"),
        (6, "Multiplication", "Estimate products"),

        # Division
        (6, "Division", "Divisibility rules"),
        (6, "Division", "Division patterns with zeroes"),
        (6, "Division", "Divide numbers ending in zeroes: word problems"),
        (6, "Division", "Estimate quotients"),
        (6, "Division", "Divide whole numbers - two-digit divisors"),

        # Number theory
        (6, "Number theory", "Prime or composite"),
        (6, "Number theory", "Identify factors"),
        (6, "Number theory", "Prime factorisation"),
        (6, "Number theory", "Prime factorisation with exponents"),
        (6, "Number theory", "Highest common factor"),
        (6, "Number theory", "Lowest common multiple"),
        (6, "Number theory", "HCF and LCM: word problems"),

        # Decimals
        (6, "Decimals", "What decimal number is illustrated?"),
        (6, "Decimals", "Decimal place values"),
        (6, "Decimals", "Word names for decimal numbers"),
        (6, "Decimals", "Convert decimals to mixed numbers"),
        (6, "Decimals", "Put decimal numbers in order"),
        (6, "Decimals", "Inequalities with decimals"),
        (6, "Decimals", "Round decimals"),
        (6, "Decimals", "Round whole numbers and decimals: find the missing digit"),
        (6, "Decimals", "Decimal number lines"),

        # Add and subtract decimals
        (6, "Add and subtract decimals", "Add and subtract decimal numbers"),
        (6, "Add and subtract decimals", "Add and subtract decimals: word problems"),
        (6, "Add and subtract decimals", "Estimate sums and differences of decimals"),
        (6, "Add and subtract decimals", "Maps with decimal distances"),

        # Fractions and mixed numbers
        (6, "Fractions and mixed numbers", "Fractions and mixed numbers"),
        (6, "Fractions and mixed numbers", "Understanding fractions: word problems"),
        (6, "Fractions and mixed numbers", "Equivalent fractions"),
        (6, "Fractions and mixed numbers", "Write fractions in lowest terms"),
        (6, "Fractions and mixed numbers", "Fractions: word problems"),
        (6, "Fractions and mixed numbers", "Lowest common denominator"),
        (6, "Fractions and mixed numbers", "Compare fractions with like and unlike denominators"),
        (6, "Fractions and mixed numbers", "Compare fractions: word problems"),
        (6, "Fractions and mixed numbers", "Convert between improper fractions and mixed numbers"),
        (6, "Fractions and mixed numbers", "Convert between decimals and fractions or mixed numbers"),
        (6, "Fractions and mixed numbers", "Put a mix of decimals, fractions and mixed numbers in order"),

        # Add and subtract fractions
        (6, "Add and subtract fractions", "Add and subtract fractions with like denominators"),
        (6, "Add and subtract fractions", "Add and subtract fractions with like denominators: word problems"),
        (6, "Add and subtract fractions", "Add and subtract fractions with unlike denominators"),
        (6, "Add and subtract fractions", "Add and subtract fractions with unlike denominators: word problems"),
        (6, "Add and subtract fractions", "Inequalities with addition and subtraction of like and unlike fractions"),
        (6, "Add and subtract fractions", "Add and subtract mixed numbers"),
        (6, "Add and subtract fractions", "Add and subtract mixed numbers: word problems"),
        (6, "Add and subtract fractions", "Estimate sums and differences of mixed numbers"),

        # Integers
        (6, "Integers", "Understanding integers"),
        (6, "Integers", "Integers on number lines"),
        (6, "Integers", "Graph integers on horizontal and vertical number lines"),
        (6, "Integers", "Compare and order integers"),

        # Operations with integers
        (6, "Operations with integers", "Add integers using counters"),
        (6, "Operations with integers", "Add integers"),
        (6, "Operations with integers", "Subtract integers using counters"),
        (6, "Operations with integers", "Subtract integers"),
        (6, "Operations with integers", "Add and subtract integers: find the sign"),
        (6, "Operations with integers", "Add and subtract integers: input/output tables"),
        (6, "Operations with integers", "Add three or more integers"),

        # Mixed operations
        (6, "Mixed operations", "Add, subtract, multiply or divide two whole numbers"),
        (6, "Mixed operations", "Add, subtract, multiply or divide two whole numbers: word problems"),
        (6, "Mixed operations", "Evaluate numerical expressions"),
        (6, "Mixed operations", "Add and subtract decimals or fractions"),
        (6, "Mixed operations", "Add and subtract decimals or fractions: word problems"),
        (6, "Mixed operations", "Add, subtract, multiply or divide two integers"),

        # Problem solving and estimation
        (6, "Problem solving and estimation", "Estimate to solve word problems"),
        (6, "Problem solving and estimation", "Multi-step word problems"),
        (6, "Problem solving and estimation", "Word problems with extra or missing information"),
        (6, "Problem solving and estimation", "Guess-and-check word problems"),
        (6, "Problem solving and estimation", "Distance/direction to starting point"),
        (6, "Problem solving and estimation", "Use logical reasoning to find the order"),

        # Ratios and rates
        (6, "Ratios and rates", "Write a ratio"),
        (6, "Ratios and rates", "Write a ratio: word problems"),
        (6, "Ratios and rates", "Identify equivalent ratios"),
        (6, "Ratios and rates", "Write an equivalent ratio"),
        (6, "Ratios and rates", "Ratio tables"),
        (6, "Ratios and rates", "Unit rates and equivalent rates"),
        (6, "Ratios and rates", "Compare ratios: word problems"),
        (6, "Ratios and rates", "Do the ratios form a proportion?"),
        (6, "Ratios and rates", "Solve the proportion"),
        (6, "Ratios and rates", "Scale drawings: word problems"),

        # Units of measurement
        (6, "Units of measurement", "Estimate metric measurements"),
        (6, "Units of measurement", "Convert and compare metric units"),
        (6, "Units of measurement", "Metric mixed units"),
        (6, "Units of measurement", "Convert square and cubic units of length"),
        (6, "Units of measurement", "Convert between cubic metres and litres"),
        (6, "Units of measurement", "Compare temperatures above and below zero"),

        # Money
        (6, "Money", "Find the number of each type of coin"),
        (6, "Money", "Add and subtract money amounts"),
        (6, "Money", "Add and subtract money amounts: word problems"),
        (6, "Money", "Multiply money: word problems"),
        (6, "Money", "Divide money amounts"),
        (6, "Money", "Divide money amounts: word problems"),

        # Time
        (6, "Time", "Elapsed time"),
        (6, "Time", "Time units"),
        (6, "Time", "Find start and end times"),
        (6, "Time", "Convert between 12-hour and 24-hour time"),
        (6, "Time", "Transportation schedules"),

        # Expressions and properties
        (6, "Expressions and properties", "Write variable expressions"),
        (6, "Expressions and properties", "Evaluate variable expressions"),
        (6, "Expressions and properties", "Properties of addition and multiplication"),
        (6, "Expressions and properties", "Multiply using the distributive property"),
        (6, "Expressions and properties", "Write equivalent expressions using properties"),
        (6, "Expressions and properties", "Properties of addition"),
        (6, "Expressions and properties", "Properties of multiplication"),
        (6, "Expressions and properties", "Solve for a variable using properties of multiplication"),
        (6, "Expressions and properties", "Identify equivalent expressions"),

        # One-variable equations
        (6, "One-variable equations", "Write variable equations: word problems"),
        (6, "One-variable equations", "Solve equations using properties"),
        (6, "One-variable equations", "Solve equations"),

        # Two-dimensional figures
        (6, "Two-dimensional figures", "Is it a polygon?"),
        (6, "Two-dimensional figures", "Types of angles"),
        (6, "Two-dimensional figures", "Measure angles with a protractor"),
        (6, "Two-dimensional figures", "Regular and irregular polygons"),
        (6, "Two-dimensional figures", "Number of sides in polygons"),
        (6, "Two-dimensional figures", "Classify triangles"),
        (6, "Two-dimensional figures", "Identify trapeziums"),
        (6, "Two-dimensional figures", "Classify quadrilaterals"),
        (6, "Two-dimensional figures", "Graph triangles and quadrilaterals"),
        (6, "Two-dimensional figures", "Find the unknown angle in triangles and quadrilaterals"),
        (6, "Two-dimensional figures", "Lines, line segments and rays"),
        (6, "Two-dimensional figures", "Parallel, perpendicular and intersecting lines"),
        (6, "Two-dimensional figures", "Parts of a circle"),

        # Symmetry and transformations
        (6, "Symmetry and transformations", "Lines of symmetry"),
        (6, "Symmetry and transformations", "Rotational symmetry"),
        (6, "Symmetry and transformations", "Reflection, rotation and translation"),
        (6, "Symmetry and transformations", "Identify congruent and similar figures"),

        # Constructions
        (6, "Constructions", "Construct the midpoint or perpendicular bisector of a segment"),
        (6, "Constructions", "Construct an angle bisector"),
        (6, "Constructions", "Construct a perpendicular line"),
        (6, "Constructions", "Construct an equilateral triangle or regular hexagon"),

        # Three-dimensional figures
        (6, "Three-dimensional figures", "Identify three-dimensional figures"),
        (6, "Three-dimensional figures", "Count vertices, edges and faces"),
        (6, "Three-dimensional figures", "Which figure is being described?"),
        (6, "Three-dimensional figures", "Nets of three-dimensional figures"),
        (6, "Three-dimensional figures", "Three-dimensional figures viewed from different perspectives"),

        # Geometric measurement
        (6, "Geometric measurement", "Perimeter"),
        (6, "Geometric measurement", "Area of squares and rectangles"),
        (6, "Geometric measurement", "Area of compound figures"),
        (6, "Geometric measurement", "Area between two rectangles"),
        (6, "Geometric measurement", "Area and perimeter of figures on grids"),
        (6, "Geometric measurement", "Area and perimeter: word problems"),
        (6, "Geometric measurement", "Use area and perimeter to determine cost"),
        (6, "Geometric measurement", "Volume of figures made of unit cubes"),

        # Data and graphs
        (6, "Data and graphs", "Interpret pictographs"),
        (6, "Data and graphs", "Create pictographs"),
        (6, "Data and graphs", "Interpret stem-and-leaf plots"),
        (6, "Data and graphs", "Create stem-and-leaf plots"),
        (6, "Data and graphs", "Interpret line plots"),
        (6, "Data and graphs", "Create line plots"),
        (6, "Data and graphs", "Create frequency tables"),
        (6, "Data and graphs", "Interpret bar graphs"),
        (6, "Data and graphs", "Create bar graphs"),
        (6, "Data and graphs", "Interpret histograms"),
        (6, "Data and graphs", "Create histograms"),
        (6, "Data and graphs", "Interpret line graphs"),
        (6, "Data and graphs", "Create line graphs"),

        # Probability
        (6, "Probability", "Combinations"),
        (6, "Probability", "Make predictions"),
        (6, "Probability", "Compound events - find the number of outcomes by counting"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class VI maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class6_skills()
