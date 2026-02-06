"""
Script to insert Class VIII maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class8_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class VIII maths skills data
    skills_data = [
        # Number theory
        (8, "Number theory", "Factors"),
        (8, "Number theory", "Divisibility rules"),
        (8, "Number theory", "Prime or composite"),
        (8, "Number theory", "Prime factorisation"),
        (8, "Number theory", "Highest common factor"),
        (8, "Number theory", "Lowest common multiple"),
        (8, "Number theory", "HCF and LCM: word problems"),
        (8, "Number theory", "Classify numbers"),

        # Integers
        (8, "Integers", "Integers on number lines"),
        (8, "Integers", "Graph integers on horizontal and vertical number lines"),
        (8, "Integers", "Compare and order integers"),

        # Operations with integers
        (8, "Operations with integers", "Integer addition and subtraction rules"),
        (8, "Operations with integers", "Add and subtract integers using counters"),
        (8, "Operations with integers", "Add and subtract integers"),
        (8, "Operations with integers", "Add and subtract three or more integers"),
        (8, "Operations with integers", "Add and subtract integers: word problems"),
        (8, "Operations with integers", "Integer multiplication and division rules"),
        (8, "Operations with integers", "Multiply and divide integers"),
        (8, "Operations with integers", "Evaluate numerical expressions involving integers"),

        # Rational numbers
        (8, "Rational numbers", "Identify rational and irrational numbers"),
        (8, "Rational numbers", "Write fractions in lowest terms"),
        (8, "Rational numbers", "Lowest common denominator"),
        (8, "Rational numbers", "Round decimals and mixed numbers"),
        (8, "Rational numbers", "Convert between decimals and fractions or mixed numbers"),
        (8, "Rational numbers", "Compare rational numbers"),
        (8, "Rational numbers", "Put rational numbers in order"),

        # Operations with rational numbers
        (8, "Operations with rational numbers", "Reciprocals and multiplicative inverses"),
        (8, "Operations with rational numbers", "Add and subtract rational numbers"),
        (8, "Operations with rational numbers", "Add and subtract rational numbers: word problems"),
        (8, "Operations with rational numbers", "Apply addition and subtraction rules"),
        (8, "Operations with rational numbers", "Multiply and divide rational numbers"),
        (8, "Operations with rational numbers", "Multiply and divide rational numbers: word problems"),
        (8, "Operations with rational numbers", "Apply multiplication and division rules"),
        (8, "Operations with rational numbers", "Apply addition, subtraction, multiplication and division rules"),
        (8, "Operations with rational numbers", "Evaluate numerical expressions involving rational numbers"),

        # Exponents and roots
        (8, "Exponents and roots", "Understanding exponents"),
        (8, "Exponents and roots", "Evaluate powers"),
        (8, "Exponents and roots", "Solve equations with variable exponents"),
        (8, "Exponents and roots", "Powers with negative bases"),
        (8, "Exponents and roots", "Powers with decimal and fractional bases"),
        (8, "Exponents and roots", "Understanding negative exponents"),
        (8, "Exponents and roots", "Evaluate powers with negative exponents"),
        (8, "Exponents and roots", "Multiplication with exponents"),
        (8, "Exponents and roots", "Division with exponents"),
        (8, "Exponents and roots", "Multiplication and division with exponents"),
        (8, "Exponents and roots", "Power rule"),
        (8, "Exponents and roots", "Evaluate expressions using properties of exponents"),
        (8, "Exponents and roots", "Identify equivalent expressions involving exponents"),
        (8, "Exponents and roots", "Square roots of perfect squares"),
        (8, "Exponents and roots", "Positive and negative square roots"),
        (8, "Exponents and roots", "Estimate positive and negative square roots"),
        (8, "Exponents and roots", "Relationship between squares and square roots"),
        (8, "Exponents and roots", "Solve equations involving squares and square roots"),
        (8, "Exponents and roots", "Cube roots of perfect cubes"),
        (8, "Exponents and roots", "Estimate cube roots"),
        (8, "Exponents and roots", "Solve equations involving cubes and cube roots"),

        # Scientific notation
        (8, "Scientific notation", "Convert between standard and scientific notation"),
        (8, "Scientific notation", "Compare numbers written in scientific notation"),
        (8, "Scientific notation", "Multiply numbers written in scientific notation"),
        (8, "Scientific notation", "Divide numbers written in scientific notation"),

        # Ratios, rates and proportions
        (8, "Ratios, rates and proportions", "Understanding ratios"),
        (8, "Ratios, rates and proportions", "Identify equivalent ratios"),
        (8, "Ratios, rates and proportions", "Write an equivalent ratio"),
        (8, "Ratios, rates and proportions", "Equivalent ratios: word problems"),
        (8, "Ratios, rates and proportions", "Unit rates"),
        (8, "Ratios, rates and proportions", "Compare ratios: word problems"),
        (8, "Ratios, rates and proportions", "Solve proportions: word problems"),
        (8, "Ratios, rates and proportions", "Do the ratios form a proportion?"),
        (8, "Ratios, rates and proportions", "Do the ratios form a proportion: word problems"),
        (8, "Ratios, rates and proportions", "Solve proportions"),
        (8, "Ratios, rates and proportions", "Estimate population size using proportions"),
        (8, "Ratios, rates and proportions", "Scale drawings: word problems"),
        (8, "Ratios, rates and proportions", "Rate of change"),
        (8, "Ratios, rates and proportions", "Constant rate of change"),

        # Proportional relationships
        (8, "Proportional relationships", "Find the constant of proportionality from a table"),
        (8, "Proportional relationships", "Write equations for proportional relationships from tables"),
        (8, "Proportional relationships", "Identify proportional relationships by graphing"),
        (8, "Proportional relationships", "Find the constant of proportionality from a graph"),
        (8, "Proportional relationships", "Write equations for proportional relationships from graphs"),
        (8, "Proportional relationships", "Identify proportional relationships"),
        (8, "Proportional relationships", "Graph proportional relationships"),
        (8, "Proportional relationships", "Interpret graphs of proportional relationships"),
        (8, "Proportional relationships", "Write and solve equations for proportional relationships"),

        # Percents
        (8, "Percents", "Convert between percents, fractions and decimals"),
        (8, "Percents", "Compare percents to fractions and decimals"),
        (8, "Percents", "Find what percent one number is of another"),
        (8, "Percents", "Find what percent one number is of another: word problems"),
        (8, "Percents", "Estimate percents of numbers"),
        (8, "Percents", "Percents of numbers and money amounts"),
        (8, "Percents", "Percents of numbers: word problems"),
        (8, "Percents", "Compare percents of numbers"),
        (8, "Percents", "Solve percent equations"),
        (8, "Percents", "Percent of change"),
        (8, "Percents", "Percent of change: word problems"),

        # Consumer maths
        (8, "Consumer maths", "Price lists"),
        (8, "Consumer maths", "Unit prices"),
        (8, "Consumer maths", "Unit prices: find the total price"),
        (8, "Consumer maths", "Percent of a number: VAT, discount and more"),
        (8, "Consumer maths", "Find the percent: discount and mark-up"),
        (8, "Consumer maths", "Sale prices: find the original price"),
        (8, "Consumer maths", "Multi-step problems with percents"),
        (8, "Consumer maths", "Estimate tips"),
        (8, "Consumer maths", "Simple interest"),
        (8, "Consumer maths", "Compound interest"),

        # Units of measurement
        (8, "Units of measurement", "Convert rates and measurements: metric units"),
        (8, "Units of measurement", "Metric mixed units"),
        (8, "Units of measurement", "Convert square and cubic units of length"),
        (8, "Units of measurement", "Convert between cubic metres and litres"),
        (8, "Units of measurement", "Precision"),

        # Problem solving
        (8, "Problem solving", "Multi-step word problems"),
        (8, "Problem solving", "Guess-and-check word problems"),
        (8, "Problem solving", "Use Venn diagrams to solve problems"),
        (8, "Problem solving", "Elapsed time word problems"),

        # Coordinate plane
        (8, "Coordinate plane", "Points on a coordinate plane"),
        (8, "Coordinate plane", "Quadrants and axes"),
        (8, "Coordinate plane", "Follow directions on a coordinate plane"),

        # Two-dimensional figures
        (8, "Two-dimensional figures", "Identify and classify polygons"),
        (8, "Two-dimensional figures", "Classify triangles"),
        (8, "Two-dimensional figures", "Identify trapeziums"),
        (8, "Two-dimensional figures", "Classify quadrilaterals"),
        (8, "Two-dimensional figures", "Graph triangles and quadrilaterals"),
        (8, "Two-dimensional figures", "Properties of parallelograms"),
        (8, "Two-dimensional figures", "Properties of rhombuses"),
        (8, "Two-dimensional figures", "Properties of squares and rectangles"),
        (8, "Two-dimensional figures", "Find missing angles in triangles and quadrilaterals"),
        (8, "Two-dimensional figures", "Interior angles of polygons"),
        (8, "Two-dimensional figures", "Lines, line segments and half lines"),
        (8, "Two-dimensional figures", "Identify complementary, supplementary, vertical, adjacent and congruent angles"),
        (8, "Two-dimensional figures", "Find measures of complementary, supplementary, vertical and adjacent angles"),
        (8, "Two-dimensional figures", "Transversal of parallel lines"),
        (8, "Two-dimensional figures", "Find lengths and measures of bisected line segments and angles"),
        (8, "Two-dimensional figures", "Parts of a circle"),
        (8, "Two-dimensional figures", "Symmetry"),
        (8, "Two-dimensional figures", "Count lines of symmetry"),
        (8, "Two-dimensional figures", "Draw lines of symmetry"),

        # Congruence and similarity
        (8, "Congruence and similarity", "Similar and congruent figures"),
        (8, "Congruence and similarity", "Side lengths and angle measures of congruent figures"),
        (8, "Congruence and similarity", "Congruence statements and corresponding parts"),
        (8, "Congruence and similarity", "Congruent triangles: SSS, SAS and ASA"),
        (8, "Congruence and similarity", "Side lengths and angle measures of similar figures"),

        # Constructions
        (8, "Constructions", "Construct the midpoint or perpendicular bisector of a segment"),
        (8, "Constructions", "Construct an angle bisector"),
        (8, "Constructions", "Construct a congruent angle"),
        (8, "Constructions", "Construct a perpendicular line"),
        (8, "Constructions", "Construct parallel lines"),
        (8, "Constructions", "Construct an equilateral triangle or regular hexagon"),

        # Pythagoras' theorem
        (8, "Pythagoras' theorem", "Pythagoras' theorem: find the length of the hypotenuse"),
        (8, "Pythagoras' theorem", "Pythagoras' theorem: find the missing leg length"),
        (8, "Pythagoras' theorem", "Pythagoras' theorem: find the perimeter"),
        (8, "Pythagoras' theorem", "Pythagoras' theorem: word problems"),
        (8, "Pythagoras' theorem", "Converse of Pythagoras' theorem: is it a right triangle?"),

        # Three-dimensional figures
        (8, "Three-dimensional figures", "Parts of three-dimensional figures"),
        (8, "Three-dimensional figures", "Nets of three-dimensional figures"),
        (8, "Three-dimensional figures", "Front, side and top view"),
        (8, "Three-dimensional figures", "Base plans"),
        (8, "Three-dimensional figures", "Similar solids"),

        # Geometric measurement
        (8, "Geometric measurement", "Perimeter"),
        (8, "Geometric measurement", "Area"),
        (8, "Geometric measurement", "Area between two shapes"),
        (8, "Geometric measurement", "Area and perimeter: word problems"),
        (8, "Geometric measurement", "Circles, semicircles and quarter circles"),
        (8, "Geometric measurement", "Circles: word problems"),
        (8, "Geometric measurement", "Volume of prisms and cylinders"),
        (8, "Geometric measurement", "Surface area of prisms and cylinders"),
        (8, "Geometric measurement", "Volume and surface area of similar solids"),
        (8, "Geometric measurement", "Perimeter, area and volume: changes in scale"),

        # Number sequences
        (8, "Number sequences", "Identify arithmetic and geometric sequences"),
        (8, "Number sequences", "Arithmetic sequences"),
        (8, "Number sequences", "Geometric sequences"),
        (8, "Number sequences", "Number sequences: mixed review"),
        (8, "Number sequences", "Number sequences: word problems"),
        (8, "Number sequences", "Evaluate variable expressions for number sequences"),
        (8, "Number sequences", "Write variable expressions for arithmetic sequences"),

        # Expressions and properties
        (8, "Expressions and properties", "Write variable expressions"),
        (8, "Expressions and properties", "Write variable expressions from diagrams"),
        (8, "Expressions and properties", "Write variable expressions: word problems"),
        (8, "Expressions and properties", "Evaluate one-variable expressions"),
        (8, "Expressions and properties", "Evaluate multi-variable expressions"),
        (8, "Expressions and properties", "Evaluate absolute value expressions"),
        (8, "Expressions and properties", "Evaluate radical expressions"),
        (8, "Expressions and properties", "Evaluate rational expressions"),
        (8, "Expressions and properties", "Identify terms and coefficients"),
        (8, "Expressions and properties", "Sort factors of expressions"),
        (8, "Expressions and properties", "Properties of addition and multiplication"),
        (8, "Expressions and properties", "Multiply using the distributive property"),
        (8, "Expressions and properties", "Simplify variable expressions using properties"),
        (8, "Expressions and properties", "Add and subtract like terms"),
        (8, "Expressions and properties", "Add, subtract and multiply linear expressions"),
        (8, "Expressions and properties", "Factors of linear expressions"),
        (8, "Expressions and properties", "Identify equivalent linear expressions"),

        # One-variable equations
        (8, "One-variable equations", "Which x satisfies an equation?"),
        (8, "One-variable equations", "Write an equation from words"),
        (8, "One-variable equations", "Model and solve equations using algebra tiles"),
        (8, "One-variable equations", "Write and solve equations that represent diagrams"),
        (8, "One-variable equations", "Properties of equality"),
        (8, "One-variable equations", "Solve one-step equations"),
        (8, "One-variable equations", "Solve two-step equations"),
        (8, "One-variable equations", "Solve multi-step equations"),
        (8, "One-variable equations", "Solve equations involving like terms"),
        (8, "One-variable equations", "Solve equations: complete the solution"),
        (8, "One-variable equations", "Solve equations: word problems"),

        # Monomials and polynomials
        (8, "Monomials and polynomials", "Identify monomials"),
        (8, "Monomials and polynomials", "Model polynomials with algebra tiles"),
        (8, "Monomials and polynomials", "Add and subtract polynomials using algebra tiles"),
        (8, "Monomials and polynomials", "Add and subtract polynomials"),
        (8, "Monomials and polynomials", "Add polynomials to find perimeter"),
        (8, "Monomials and polynomials", "Multiply monomials"),
        (8, "Monomials and polynomials", "Divide monomials"),
        (8, "Monomials and polynomials", "Multiply and divide monomials"),
        (8, "Monomials and polynomials", "Powers of monomials"),
        (8, "Monomials and polynomials", "Square and cube roots of monomials"),
        (8, "Monomials and polynomials", "Multiply polynomials using algebra tiles"),
        (8, "Monomials and polynomials", "Multiply polynomials"),
        (8, "Monomials and polynomials", "Multiply polynomials to find area"),

        # Factorising
        (8, "Factorising", "HCF of monomials"),
        (8, "Factorising", "Factorise out a monomial"),
        (8, "Factorising", "Factorise quadratics with leading coefficient 1"),
        (8, "Factorising", "Factorise quadratics with other leading coefficients"),
        (8, "Factorising", "Factorise quadratics: special cases"),
        (8, "Factorising", "Factorise quadratics using algebra tiles"),
        (8, "Factorising", "Factorise by grouping"),
        (8, "Factorising", "Factorise polynomials"),

        # Data and graphs
        (8, "Data and graphs", "Interpret tables"),
        (8, "Data and graphs", "Interpret bar graphs"),
        (8, "Data and graphs", "Create bar graphs"),
        (8, "Data and graphs", "Interpret line graphs"),
        (8, "Data and graphs", "Create line graphs"),
        (8, "Data and graphs", "Interpret line plots"),
        (8, "Data and graphs", "Create line plots"),
        (8, "Data and graphs", "Interpret stem-and-leaf plots"),
        (8, "Data and graphs", "Create stem-and-leaf plots"),
        (8, "Data and graphs", "Interpret histograms"),
        (8, "Data and graphs", "Create histograms"),
        (8, "Data and graphs", "Create frequency tables"),
        (8, "Data and graphs", "Interpret pie charts"),
        (8, "Data and graphs", "Pie charts and central angles"),
        (8, "Data and graphs", "Choose the best type of graph"),

        # Statistics
        (8, "Statistics", "Calculate mean, median, mode and range"),
        (8, "Statistics", "Interpret charts to find mean, median, mode and range"),
        (8, "Statistics", "Mean, median, mode and range: find the missing number"),
        (8, "Statistics", "Changes in mean, median, mode and range"),

        # Probability
        (8, "Probability", "Probability of simple events"),
        (8, "Probability", "Probability of opposite, mutually exclusive and overlapping events"),
        (8, "Probability", "Experimental probability"),
        (8, "Probability", "Make predictions"),
        (8, "Probability", "Compound events: find the number of outcomes"),
        (8, "Probability", "Counting principle"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class VIII maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class8_skills()
