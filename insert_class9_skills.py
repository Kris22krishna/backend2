"""
Script to insert Class IX maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class9_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class IX maths skills data
    skills_data = [
        # Numbers
        (9, "Numbers", "Classify numbers"),
        (9, "Numbers", "Compare and order rational numbers"),
        (9, "Numbers", "Number lines"),
        (9, "Numbers", "Convert between decimals and fractions"),
        (9, "Numbers", "Square roots"),
        (9, "Numbers", "Cube roots"),

        # Operations
        (9, "Operations", "Add, subtract, multiply and divide integers"),
        (9, "Operations", "Evaluate numerical expressions involving integers"),
        (9, "Operations", "Evaluate variable expressions involving integers"),
        (9, "Operations", "Add and subtract rational numbers"),
        (9, "Operations", "Multiply and divide rational numbers"),
        (9, "Operations", "Evaluate numerical expressions involving rational numbers"),
        (9, "Operations", "Evaluate variable expressions involving rational numbers"),

        # Ratios, rates and proportions
        (9, "Ratios, rates and proportions", "Identify equivalent ratios"),
        (9, "Ratios, rates and proportions", "Write an equivalent ratio"),
        (9, "Ratios, rates and proportions", "Unit rates"),
        (9, "Ratios, rates and proportions", "Unit prices"),
        (9, "Ratios, rates and proportions", "Solve proportions"),
        (9, "Ratios, rates and proportions", "Solve proportions: word problems"),
        (9, "Ratios, rates and proportions", "Scale drawings: word problems"),

        # Percents
        (9, "Percents", "Convert between percents, fractions and decimals"),
        (9, "Percents", "Solve percent equations"),
        (9, "Percents", "Percent word problems"),
        (9, "Percents", "Percent of change"),
        (9, "Percents", "Percent of change: word problems"),
        (9, "Percents", "Percent of a number: VAT, discount and more"),
        (9, "Percents", "Find the percent: discount and mark-up"),
        (9, "Percents", "Multi-step problems with percents"),

        # Measurement
        (9, "Measurement", "Convert rates and measurements"),
        (9, "Measurement", "Precision"),
        (9, "Measurement", "Greatest possible error"),
        (9, "Measurement", "Minimum and maximum area and volume"),
        (9, "Measurement", "Percent error"),
        (9, "Measurement", "Percent error: area and volume"),

        # Lines and angles
        (9, "Lines and angles", "Transversals: name angle pairs"),
        (9, "Lines and angles", "Transversals of parallel lines: find angle measures"),
        (9, "Lines and angles", "Identify complementary, supplementary, vertical, adjacent and congruent angles"),
        (9, "Lines and angles", "Find measures of complementary, supplementary, vertical and adjacent angles"),

        # Triangles
        (9, "Triangles", "Classify triangles"),
        (9, "Triangles", "Triangle angle-sum property"),
        (9, "Triangles", "Exterior angle property"),
        (9, "Triangles", "Exterior angle inequality"),
        (9, "Triangles", "Angle-side relationships in triangles"),
        (9, "Triangles", "Triangle Inequality Theorem"),
        (9, "Triangles", "Midsegments of triangles"),
        (9, "Triangles", "SSS, SAS and ASA Theorems"),
        (9, "Triangles", "SSS Theorem in the coordinate plane"),
        (9, "Triangles", "Congruency in isosceles and equilateral triangles"),
        (9, "Triangles", "Hypotenuse-Leg Theorem"),

        # Quadrilaterals
        (9, "Quadrilaterals", "Classify quadrilaterals"),
        (9, "Quadrilaterals", "Graph quadrilaterals"),
        (9, "Quadrilaterals", "Properties of parallelograms"),
        (9, "Quadrilaterals", "Proving a quadrilateral is a parallelogram"),
        (9, "Quadrilaterals", "Properties of rhombuses"),
        (9, "Quadrilaterals", "Properties of squares and rectangles"),
        (9, "Quadrilaterals", "Properties of trapeziums"),
        (9, "Quadrilaterals", "Properties of kites"),
        (9, "Quadrilaterals", "Review: properties of quadrilaterals"),

        # Polygons
        (9, "Polygons", "Polygon vocabulary"),
        (9, "Polygons", "Interior angles of polygons"),
        (9, "Polygons", "Exterior angles of polygons"),
        (9, "Polygons", "Review: interior and exterior angles of polygons"),

        # Area and perimeter
        (9, "Area and perimeter", "Perimeter"),
        (9, "Area and perimeter", "Area of rectangles and squares"),
        (9, "Area and perimeter", "Area of parallelograms and triangles"),
        (9, "Area and perimeter", "Area of trapeziums"),
        (9, "Area and perimeter", "Area and circumference of circles"),
        (9, "Area and perimeter", "Area of compound figures"),
        (9, "Area and perimeter", "Area between two shapes"),
        (9, "Area and perimeter", "Area and perimeter mixed review"),
        (9, "Area and perimeter", "Heron's formula"),

        # Surface area and volume
        (9, "Surface area and volume", "Introduction to surface area and volume"),
        (9, "Surface area and volume", "Surface area of prisms and cylinders"),
        (9, "Surface area and volume", "Surface area of cones"),
        (9, "Surface area and volume", "Volume of prisms and cylinders"),
        (9, "Surface area and volume", "Volume of cones"),
        (9, "Surface area and volume", "Surface area and volume of spheres"),
        (9, "Surface area and volume", "Surface area and volume review"),

        # Circles
        (9, "Circles", "Parts of a circle"),
        (9, "Circles", "Central angles"),
        (9, "Circles", "Arc measure and arc length"),
        (9, "Circles", "Area of sectors"),
        (9, "Circles", "Circle measurements: mixed review"),
        (9, "Circles", "Arcs and chords"),
        (9, "Circles", "Tangent lines"),
        (9, "Circles", "Perimeter of polygons with an inscribed circle"),
        (9, "Circles", "Inscribed angles"),
        (9, "Circles", "Angles in inscribed right triangles"),
        (9, "Circles", "Angles in inscribed quadrilaterals"),

        # Constructions
        (9, "Constructions", "Construct the midpoint or perpendicular bisector of a segment"),
        (9, "Constructions", "Construct an angle bisector"),
        (9, "Constructions", "Construct a congruent angle"),
        (9, "Constructions", "Construct an equilateral triangle or regular hexagon"),

        # Solve equations
        (9, "Solve equations", "Model and solve equations using algebra tiles"),
        (9, "Solve equations", "Write and solve equations that represent diagrams"),
        (9, "Solve equations", "Solve one-step linear equations"),
        (9, "Solve equations", "Solve two-step linear equations"),
        (9, "Solve equations", "Solve advanced linear equations"),
        (9, "Solve equations", "Solve equations with variables on both sides"),
        (9, "Solve equations", "Solve equations: complete the solution"),
        (9, "Solve equations", "Find the number of solutions"),
        (9, "Solve equations", "Create equations with no solutions or infinitely many solutions"),
        (9, "Solve equations", "Solve linear equations: word problems"),
        (9, "Solve equations", "Solve linear equations: mixed review"),

        # Data and graphs
        (9, "Data and graphs", "Interpret bar graphs, line graphs and histograms"),
        (9, "Data and graphs", "Create bar graphs, line graphs and histograms"),
        (9, "Data and graphs", "Interpret pie charts"),
        (9, "Data and graphs", "Interpret stem-and-leaf plots"),

        # Problem solving
        (9, "Problem solving", "Word problems: mixed review"),
        (9, "Problem solving", "Word problems with money"),
        (9, "Problem solving", "Consecutive integer problems"),
        (9, "Problem solving", "Rate of travel: word problems"),
        (9, "Problem solving", "Weighted averages: word problems"),

        # Logic
        (9, "Logic", "Identify hypotheses and conclusions"),
        (9, "Logic", "Counterexamples"),

        # Coordinate plane
        (9, "Coordinate plane", "Coordinate plane review"),
        (9, "Coordinate plane", "Quadrants and axes"),

        # Direct variation
        (9, "Direct variation", "Identify proportional relationships"),
        (9, "Direct variation", "Find the constant of variation"),
        (9, "Direct variation", "Graph a proportional relationship"),
        (9, "Direct variation", "Write direct variation equations"),
        (9, "Direct variation", "Write and solve direct variation equations"),

        # Linear equations
        (9, "Linear equations", "Identify linear equations"),
        (9, "Linear equations", "Find the slope of a graph"),
        (9, "Linear equations", "Find the slope from two points"),
        (9, "Linear equations", "Find a missing coordinate using slope"),
        (9, "Linear equations", "Slope-intercept form: find the slope and y-intercept"),
        (9, "Linear equations", "Slope-intercept form: graph an equation"),
        (9, "Linear equations", "Slope-intercept form: write an equation from a graph"),
        (9, "Linear equations", "Slope-intercept form: write an equation"),
        (9, "Linear equations", "Slope-intercept form: write an equation from a table"),
        (9, "Linear equations", "Slope-intercept form: write an equation from a word problem"),
        (9, "Linear equations", "Linear equations: solve for y"),
        (9, "Linear equations", "Write linear equations to solve word problems"),
        (9, "Linear equations", "Compare linear equations, graphs and tables"),
        (9, "Linear equations", "Write equations in standard form"),
        (9, "Linear equations", "Standard form: find x- and y-intercepts"),
        (9, "Linear equations", "Standard form: graph an equation"),
        (9, "Linear equations", "Equations of horizontal and vertical lines"),
        (9, "Linear equations", "Graph a horizontal or vertical line"),
        (9, "Linear equations", "Slopes of parallel and perpendicular lines"),
        (9, "Linear equations", "Write an equation for a parallel or perpendicular line"),

        # Exponents
        (9, "Exponents", "Powers with integer bases"),
        (9, "Exponents", "Powers with decimal and fractional bases"),
        (9, "Exponents", "Negative exponents"),
        (9, "Exponents", "Multiplication with exponents"),
        (9, "Exponents", "Division with exponents"),
        (9, "Exponents", "Multiplication and division with exponents"),
        (9, "Exponents", "Power rule"),
        (9, "Exponents", "Evaluate expressions using properties of exponents"),
        (9, "Exponents", "Identify equivalent expressions involving exponents"),

        # Rational exponents
        (9, "Rational exponents", "Evaluate rational exponents"),
        (9, "Rational exponents", "Multiplication with rational exponents"),
        (9, "Rational exponents", "Division with rational exponents"),
        (9, "Rational exponents", "Power rule with rational exponents"),
        (9, "Rational exponents", "Simplify expressions involving rational exponents I"),
        (9, "Rational exponents", "Simplify expressions involving rational exponents II"),

        # Logarithms
        (9, "Logarithms", "Convert between exponential and logarithmic form: rational bases"),
        (9, "Logarithms", "Evaluate logarithms"),
        (9, "Logarithms", "Change of base formula"),
        (9, "Logarithms", "Identify properties of logarithms"),
        (9, "Logarithms", "Product property of logarithms"),
        (9, "Logarithms", "Quotient property of logarithms"),
        (9, "Logarithms", "Power property of logarithms"),
        (9, "Logarithms", "Properties of logarithms: mixed review"),
        (9, "Logarithms", "Evaluate logarithms: mixed review"),

        # Scientific notation
        (9, "Scientific notation", "Convert between standard and scientific notation"),
        (9, "Scientific notation", "Compare numbers written in scientific notation"),
        (9, "Scientific notation", "Multiply numbers written in scientific notation"),
        (9, "Scientific notation", "Divide numbers written in scientific notation"),

        # Monomials
        (9, "Monomials", "Identify monomials"),
        (9, "Monomials", "Multiply monomials"),
        (9, "Monomials", "Divide monomials"),
        (9, "Monomials", "Multiply and divide monomials"),
        (9, "Monomials", "Powers of monomials"),

        # Polynomials
        (9, "Polynomials", "Polynomial vocabulary"),
        (9, "Polynomials", "Model polynomials with algebra tiles"),
        (9, "Polynomials", "Add and subtract polynomials using algebra tiles"),
        (9, "Polynomials", "Add and subtract polynomials"),
        (9, "Polynomials", "Add polynomials to find perimeter"),
        (9, "Polynomials", "Multiply a polynomial by a monomial"),
        (9, "Polynomials", "Multiply two polynomials using algebra tiles"),
        (9, "Polynomials", "Multiply two binomials"),
        (9, "Polynomials", "Multiply two binomials: special cases"),
        (9, "Polynomials", "Multiply polynomials"),
        (9, "Polynomials", "Write a polynomial from its roots"),
        (9, "Polynomials", "Find the roots of factorised polynomials"),

        # Factorising
        (9, "Factorising", "HCF of monomials"),
        (9, "Factorising", "Factorise out a monomial"),
        (9, "Factorising", "Factorise quadratics with leading coefficient 1"),
        (9, "Factorising", "Factorise quadratics with other leading coefficients"),
        (9, "Factorising", "Factorise quadratics: special cases"),
        (9, "Factorising", "Factorise quadratics using algebra tiles"),
        (9, "Factorising", "Factorise by grouping"),
        (9, "Factorising", "Factorise polynomials"),

        # Quadratic equations
        (9, "Quadratic equations", "Characteristics of quadratic equations"),
        (9, "Quadratic equations", "Complete a table: quadratic equations"),
        (9, "Quadratic equations", "Solve a quadratic equation using square roots"),
        (9, "Quadratic equations", "Solve a quadratic equation using the zero product property"),
        (9, "Quadratic equations", "Solve a quadratic equation by factorising"),
        (9, "Quadratic equations", "Solve a quadratic equation using the quadratic formula"),

        # Radical expressions
        (9, "Radical expressions", "Roots of integers"),
        (9, "Radical expressions", "Roots of rational numbers"),
        (9, "Radical expressions", "Find roots using a calculator"),
        (9, "Radical expressions", "Nth roots"),
        (9, "Radical expressions", "Simplify radical expressions with variables I"),
        (9, "Radical expressions", "Simplify radical expressions with variables II"),
        (9, "Radical expressions", "Multiply radical expressions"),
        (9, "Radical expressions", "Divide radical expressions"),
        (9, "Radical expressions", "Add and subtract radical expressions"),
        (9, "Radical expressions", "Simplify radical expressions using the distributive property"),
        (9, "Radical expressions", "Simplify radical expressions using conjugates"),

        # Rational expressions
        (9, "Rational expressions", "Simplify complex fractions"),
        (9, "Rational expressions", "Simplify rational expressions"),
        (9, "Rational expressions", "Multiply and divide rational expressions"),
        (9, "Rational expressions", "Divide polynomials"),
        (9, "Rational expressions", "Add and subtract rational expressions"),
        (9, "Rational expressions", "Solve rational equations"),

        # Probability
        (9, "Probability", "Theoretical probability"),
        (9, "Probability", "Experimental probability"),
        (9, "Probability", "Compound events: find the number of outcomes"),
        (9, "Probability", "Identify independent and dependent events"),
        (9, "Probability", "Probability of independent and dependent events"),
        (9, "Probability", "Factorials"),
        (9, "Probability", "Counting principle"),

        # Statistics
        (9, "Statistics", "Mean, median, mode and range"),
        (9, "Statistics", "Quartiles"),
        (9, "Statistics", "Identify biased samples"),
        (9, "Statistics", "Variance and standard deviation"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class IX maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class9_skills()
