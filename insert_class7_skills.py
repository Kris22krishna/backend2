"""
Script to insert Class VII maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class7_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class VII maths skills data
    skills_data = [
        # Number theory
        (7, "Number theory", "Prime or composite"),
        (7, "Number theory", "Prime factorisation"),
        (7, "Number theory", "Multiplicative inverses"),
        (7, "Number theory", "Divisibility rules"),
        (7, "Number theory", "Highest common factor"),
        (7, "Number theory", "Lowest common multiple"),
        (7, "Number theory", "HCF and LCM: word problems"),
        (7, "Number theory", "Scientific notation"),
        (7, "Number theory", "Compare numbers written in scientific notation"),
        (7, "Number theory", "Classify numbers"),

        # Integers
        (7, "Integers", "Understanding integers"),
        (7, "Integers", "Integers on number lines"),
        (7, "Integers", "Graph integers on horizontal and vertical number lines"),
        (7, "Integers", "Absolute value and opposite integers"),
        (7, "Integers", "Compare and order integers"),

        # Operations with integers
        (7, "Operations with integers", "Integer addition and subtraction rules"),
        (7, "Operations with integers", "Add and subtract integers using counters"),
        (7, "Operations with integers", "Add and subtract integers"),
        (7, "Operations with integers", "Complete addition and subtraction sentences with integers"),
        (7, "Operations with integers", "Add and subtract integers: word problems"),
        (7, "Operations with integers", "Integer multiplication and division rules"),
        (7, "Operations with integers", "Multiply and divide integers"),
        (7, "Operations with integers", "Complete multiplication and division sentences with integers"),
        (7, "Operations with integers", "Evaluate numerical expressions involving integers"),

        # Decimals
        (7, "Decimals", "Decimal numbers review"),
        (7, "Decimals", "Compare and order decimals"),
        (7, "Decimals", "Decimal number lines"),
        (7, "Decimals", "Round decimals"),

        # Operations with decimals
        (7, "Operations with decimals", "Add and subtract decimals"),
        (7, "Operations with decimals", "Add and subtract decimals: word problems"),
        (7, "Operations with decimals", "Multiply decimals"),
        (7, "Operations with decimals", "Multiply decimals and whole numbers: word problems"),
        (7, "Operations with decimals", "Divide decimals"),
        (7, "Operations with decimals", "Divide decimals by whole numbers: word problems"),
        (7, "Operations with decimals", "Estimate sums, differences and products of decimals"),
        (7, "Operations with decimals", "Add, subtract, multiply and divide decimals: word problems"),
        (7, "Operations with decimals", "Multi-step inequalities with decimals"),
        (7, "Operations with decimals", "Maps with decimal distances"),
        (7, "Operations with decimals", "Evaluate numerical expressions involving decimals"),

        # Fractions and mixed numbers
        (7, "Fractions and mixed numbers", "Understanding fractions: word problems"),
        (7, "Fractions and mixed numbers", "Equivalent fractions"),
        (7, "Fractions and mixed numbers", "Write fractions in lowest terms"),
        (7, "Fractions and mixed numbers", "Fractions: word problems with graphs and tables"),
        (7, "Fractions and mixed numbers", "Lowest common denominator"),
        (7, "Fractions and mixed numbers", "Compare and order fractions"),
        (7, "Fractions and mixed numbers", "Compare fractions: word problems"),
        (7, "Fractions and mixed numbers", "Convert between mixed numbers and improper fractions"),
        (7, "Fractions and mixed numbers", "Compare mixed numbers and improper fractions"),
        (7, "Fractions and mixed numbers", "Round mixed numbers"),

        # Operations with fractions
        (7, "Operations with fractions", "Add and subtract fractions"),
        (7, "Operations with fractions", "Add and subtract fractions: word problems"),
        (7, "Operations with fractions", "Add and subtract mixed numbers"),
        (7, "Operations with fractions", "Add and subtract mixed numbers: word problems"),
        (7, "Operations with fractions", "Inequalities with addition and subtraction of fractions and mixed numbers"),
        (7, "Operations with fractions", "Estimate sums and differences of mixed numbers"),
        (7, "Operations with fractions", "Multiply fractions and whole numbers"),
        (7, "Operations with fractions", "Multiply two fractions using models"),
        (7, "Operations with fractions", "Multiply fractions"),
        (7, "Operations with fractions", "Multiply mixed numbers"),
        (7, "Operations with fractions", "Multiply fractions and mixed numbers: word problems"),
        (7, "Operations with fractions", "Divide whole numbers and unit fractions"),
        (7, "Operations with fractions", "Divide fractions"),
        (7, "Operations with fractions", "Divide mixed numbers"),
        (7, "Operations with fractions", "Divide fractions and mixed numbers: word problems"),
        (7, "Operations with fractions", "Estimate products and quotients of fractions and mixed numbers"),
        (7, "Operations with fractions", "Add, subtract, multiply and divide fractions and mixed numbers: word problems"),
        (7, "Operations with fractions", "Evaluate numerical expressions involving fractions"),

        # Rational numbers
        (7, "Rational numbers", "Identify rational numbers"),
        (7, "Rational numbers", "Convert between decimals and fractions or mixed numbers"),
        (7, "Rational numbers", "Compare rational numbers"),
        (7, "Rational numbers", "Put rational numbers in order"),
        (7, "Rational numbers", "Add and subtract rational numbers"),
        (7, "Rational numbers", "Apply addition and subtraction rules"),
        (7, "Rational numbers", "Multiply and divide rational numbers"),
        (7, "Rational numbers", "Apply multiplication and division rules"),

        # Exponents
        (7, "Exponents", "Understanding exponents"),
        (7, "Exponents", "Evaluate powers"),
        (7, "Exponents", "Solve equations with variable exponents"),
        (7, "Exponents", "Powers with negative bases"),
        (7, "Exponents", "Powers with decimal and fractional bases"),
        (7, "Exponents", "Evaluate numerical expressions involving exponents"),

        # Ratios, rates and proportions
        (7, "Ratios, rates and proportions", "Understanding ratios"),
        (7, "Ratios, rates and proportions", "Identify equivalent ratios"),
        (7, "Ratios, rates and proportions", "Write an equivalent ratio"),
        (7, "Ratios, rates and proportions", "Equivalent ratios: word problems"),
        (7, "Ratios, rates and proportions", "Unit rates"),
        (7, "Ratios, rates and proportions", "Compare ratios: word problems"),
        (7, "Ratios, rates and proportions", "Scale drawings: word problems"),
        (7, "Ratios, rates and proportions", "Do the ratios form a proportion?"),
        (7, "Ratios, rates and proportions", "Do the ratios form a proportion: word problems"),
        (7, "Ratios, rates and proportions", "Solve proportions"),
        (7, "Ratios, rates and proportions", "Solve proportions: word problems"),
        (7, "Ratios, rates and proportions", "Estimate population size using proportions"),
        (7, "Ratios, rates and proportions", "Rate of change"),
        (7, "Ratios, rates and proportions", "Constant rate of change"),

        # Percents
        (7, "Percents", "What percentage is illustrated?"),
        (7, "Percents", "Convert between percents, fractions and decimals"),
        (7, "Percents", "Compare percents to fractions and decimals"),
        (7, "Percents", "Estimate percents of numbers"),
        (7, "Percents", "Percents of numbers and money amounts"),
        (7, "Percents", "Percents of numbers: word problems"),
        (7, "Percents", "Solve percent equations"),
        (7, "Percents", "Solve percent equations: word problems"),

        # Consumer maths
        (7, "Consumer maths", "Add, subtract, multiply and divide money amounts: word problems"),
        (7, "Consumer maths", "Price lists"),
        (7, "Consumer maths", "Unit prices"),
        (7, "Consumer maths", "Unit prices: find the total price"),
        (7, "Consumer maths", "Percent of a number, discount and more"),
        (7, "Consumer maths", "Find the percent: discount and mark-up"),
        (7, "Consumer maths", "Sale prices: find the original price"),
        (7, "Consumer maths", "Multi-step problems with percents"),
        (7, "Consumer maths", "Estimate tips"),
        (7, "Consumer maths", "Simple interest"),

        # Problem solving and estimation
        (7, "Problem solving and estimation", "Estimate to solve word problems"),
        (7, "Problem solving and estimation", "Multi-step word problems"),
        (7, "Problem solving and estimation", "Guess-and-check word problems"),
        (7, "Problem solving and estimation", "Use Venn diagrams to solve problems"),
        (7, "Problem solving and estimation", "Find the number of each type of coin"),
        (7, "Problem solving and estimation", "Elapsed time word problems"),

        # Units of measurement
        (7, "Units of measurement", "Estimate metric measurements"),
        (7, "Units of measurement", "Compare and convert metric units"),
        (7, "Units of measurement", "Metric mixed units"),
        (7, "Units of measurement", "Convert square and cubic units of length"),
        (7, "Units of measurement", "Convert between cubic metres and litres"),
        (7, "Units of measurement", "Precision"),

        # Number sequences
        (7, "Number sequences", "Identify arithmetic and geometric sequences"),
        (7, "Number sequences", "Arithmetic sequences"),
        (7, "Number sequences", "Geometric sequences"),
        (7, "Number sequences", "Number sequences: mixed review"),
        (7, "Number sequences", "Number sequences: word problems"),
        (7, "Number sequences", "Evaluate variable expressions for number sequences"),
        (7, "Number sequences", "Write variable expressions for arithmetic sequences"),

        # Expressions and properties
        (7, "Expressions and properties", "Write variable expressions"),
        (7, "Expressions and properties", "Write variable expressions: word problems"),
        (7, "Expressions and properties", "Evaluate linear expressions"),
        (7, "Expressions and properties", "Evaluate multi-variable expressions"),
        (7, "Expressions and properties", "Evaluate absolute value expressions"),
        (7, "Expressions and properties", "Evaluate nonlinear expressions"),
        (7, "Expressions and properties", "Identify terms and coefficients"),
        (7, "Expressions and properties", "Sort factors of expressions"),
        (7, "Expressions and properties", "Properties of addition and multiplication"),
        (7, "Expressions and properties", "Multiply using the distributive property"),
        (7, "Expressions and properties", "Solve equations using properties"),
        (7, "Expressions and properties", "Write equivalent expressions using properties"),
        (7, "Expressions and properties", "Add and subtract like terms"),
        (7, "Expressions and properties", "Add, subtract and multiply linear expressions"),
        (7, "Expressions and properties", "Factors of linear expressions"),
        (7, "Expressions and properties", "Identify equivalent linear expressions"),

        # One-variable equations
        (7, "One-variable equations", "Which x satisfies an equation?"),
        (7, "One-variable equations", "Write an equation from words"),
        (7, "One-variable equations", "Model and solve equations using algebra tiles"),
        (7, "One-variable equations", "Write and solve equations that represent diagrams"),
        (7, "One-variable equations", "Solve one-step equations"),
        (7, "One-variable equations", "Solve two-step equations"),
        (7, "One-variable equations", "Solve equations: word problems"),
        (7, "One-variable equations", "Solve equations involving like terms"),
        (7, "One-variable equations", "Solve equations: complete the solution"),

        # Two-dimensional figures
        (7, "Two-dimensional figures", "Identify and classify polygons"),
        (7, "Two-dimensional figures", "Name, measure and classify angles"),
        (7, "Two-dimensional figures", "Classify triangles"),
        (7, "Two-dimensional figures", "Identify trapeziums"),
        (7, "Two-dimensional figures", "Classify quadrilaterals"),
        (7, "Two-dimensional figures", "Graph triangles and quadrilaterals"),
        (7, "Two-dimensional figures", "Triangle angle-sum property"),
        (7, "Two-dimensional figures", "Exterior angle property"),
        (7, "Two-dimensional figures", "Find missing angles in triangles and quadrilaterals"),
        (7, "Two-dimensional figures", "Interior angles of polygons"),
        (7, "Two-dimensional figures", "Lines, line segments and half lines"),
        (7, "Two-dimensional figures", "Parallel, perpendicular and intersecting lines"),
        (7, "Two-dimensional figures", "Identify complementary, supplementary, vertical, adjacent and congruent angles"),
        (7, "Two-dimensional figures", "Find measures of complementary, supplementary, vertical and adjacent angles"),
        (7, "Two-dimensional figures", "Transversal of parallel lines"),
        (7, "Two-dimensional figures", "Find lengths and measures of bisected line segments and angles"),
        (7, "Two-dimensional figures", "Parts of a circle"),
        (7, "Two-dimensional figures", "Symmetry"),

        # Congruence and similarity
        (7, "Congruence and similarity", "Similar and congruent figures"),
        (7, "Congruence and similarity", "Side lengths and angle measures of congruent figures"),
        (7, "Congruence and similarity", "Congruence statements and corresponding parts"),
        (7, "Congruence and similarity", "Side lengths and angle measures of similar figures"),
        (7, "Congruence and similarity", "Similar figures and indirect measurement"),

        # Constructions
        (7, "Constructions", "Construct the midpoint or perpendicular bisector of a segment"),
        (7, "Constructions", "Construct an angle bisector"),
        (7, "Constructions", "Construct a perpendicular line"),
        (7, "Constructions", "Construct parallel lines"),
        (7, "Constructions", "Construct an equilateral triangle or regular hexagon"),

        # Pythagoras' theorem
        (7, "Pythagoras' theorem", "Pythagoras' theorem: find the length of the hypotenuse"),
        (7, "Pythagoras' theorem", "Pythagoras' theorem: find the missing leg length"),
        (7, "Pythagoras' theorem", "Pythagoras' theorem: word problems"),
        (7, "Pythagoras' theorem", "Converse of Pythagoras' theorem: is it a right triangle?"),

        # Three-dimensional figures
        (7, "Three-dimensional figures", "Bases of three-dimensional figures"),
        (7, "Three-dimensional figures", "Nets of three-dimensional figures"),
        (7, "Three-dimensional figures", "Front, side and top view"),

        # Geometric measurement
        (7, "Geometric measurement", "Perimeter"),
        (7, "Geometric measurement", "Area of rectangles and parallelograms"),
        (7, "Geometric measurement", "Area of triangles"),
        (7, "Geometric measurement", "Area and perimeter: word problems"),
        (7, "Geometric measurement", "Circles: calculate area, circumference, radius and diameter"),
        (7, "Geometric measurement", "Circles: word problems"),
        (7, "Geometric measurement", "Semicircles: calculate area, perimeter, radius and diameter"),
        (7, "Geometric measurement", "Quarter circles: calculate area, perimeter and radius"),
        (7, "Geometric measurement", "Area of compound figures with triangles, semicircles and quarter circles"),
        (7, "Geometric measurement", "Area between two shapes"),
        (7, "Geometric measurement", "Perimeter, area and volume: changes in scale"),

        # Data and graphs
        (7, "Data and graphs", "Interpret tables"),
        (7, "Data and graphs", "Interpret line plots"),
        (7, "Data and graphs", "Create line plots"),
        (7, "Data and graphs", "Interpret stem-and-leaf plots"),
        (7, "Data and graphs", "Create stem-and-leaf plots"),
        (7, "Data and graphs", "Interpret bar graphs"),
        (7, "Data and graphs", "Create bar graphs"),
        (7, "Data and graphs", "Interpret histograms"),
        (7, "Data and graphs", "Create histograms"),
        (7, "Data and graphs", "Create frequency tables"),
        (7, "Data and graphs", "Interpret line graphs"),
        (7, "Data and graphs", "Create line graphs"),

        # Statistics
        (7, "Statistics", "Calculate mean, median, mode and range"),
        (7, "Statistics", "Interpret charts to find mean, median, mode and range"),
        (7, "Statistics", "Mean, median, mode and range: find the missing number"),
        (7, "Statistics", "Changes in mean, median, mode and range"),

        # Probability
        (7, "Probability", "Probability of simple events"),
        (7, "Probability", "Probability of opposite, mutually exclusive and overlapping events"),
        (7, "Probability", "Experimental probability"),
        (7, "Probability", "Make predictions"),
        (7, "Probability", "Compound events: find the number of outcomes"),
        (7, "Probability", "Counting principle"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class VII maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class7_skills()
