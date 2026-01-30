"""
Script to insert Class X maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class10_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class X maths skills data
    skills_data = [
        # Numbers
        (10, "Numbers", "Number lines"),
        (10, "Numbers", "Convert between decimals and fractions"),
        (10, "Numbers", "Identify rational and irrational numbers"),
        (10, "Numbers", "Compare and order rational numbers"),
        (10, "Numbers", "Prime factorisation"),
        (10, "Numbers", "Square roots"),
        (10, "Numbers", "Cube roots"),

        # Operations
        (10, "Operations", "Add, subtract, multiply and divide integers"),
        (10, "Operations", "Evaluate numerical expressions involving integers"),
        (10, "Operations", "Evaluate variable expressions involving integers"),
        (10, "Operations", "Add and subtract rational numbers"),
        (10, "Operations", "Multiply and divide rational numbers"),
        (10, "Operations", "Evaluate numerical expressions involving rational numbers"),
        (10, "Operations", "Evaluate variable expressions involving rational numbers"),

        # Consumer maths
        (10, "Consumer maths", "Simple interest"),
        (10, "Consumer maths", "Compound interest"),
        (10, "Consumer maths", "Percent of a number: VAT, discount and more"),
        (10, "Consumer maths", "Find the percent: discount and mark-up"),
        (10, "Consumer maths", "Multi-step problems with percents"),

        # Linear equations
        (10, "Linear equations", "Identify linear equations"),
        (10, "Linear equations", "Find the slope of a graph"),
        (10, "Linear equations", "Find the slope from two points"),
        (10, "Linear equations", "Find a missing coordinate using slope"),
        (10, "Linear equations", "Slope-intercept form: find the slope and y-intercept"),
        (10, "Linear equations", "Slope-intercept form: graph an equation"),
        (10, "Linear equations", "Slope-intercept form: write an equation from a graph"),
        (10, "Linear equations", "Slope-intercept form: write an equation"),
        (10, "Linear equations", "Slope-intercept form: write an equation from a table"),
        (10, "Linear equations", "Slope-intercept form: write an equation from a word problem"),
        (10, "Linear equations", "Write linear equations to solve word problems"),
        (10, "Linear equations", "Compare linear equations, graphs and tables"),
        (10, "Linear equations", "Write equations in standard form"),
        (10, "Linear equations", "Standard form: find x- and y-intercepts"),
        (10, "Linear equations", "Standard form: graph an equation"),
        (10, "Linear equations", "Equations of horizontal and vertical lines"),
        (10, "Linear equations", "Graph a horizontal or vertical line"),
        (10, "Linear equations", "Slopes of parallel and perpendicular lines"),
        (10, "Linear equations", "Write an equation for a parallel or perpendicular line"),
        (10, "Linear equations", "Find the distance between a point and a line"),
        (10, "Linear equations", "Find the distance between two parallel lines"),

        # Pairs of linear equations
        (10, "Pairs of linear equations", "Is (x, y) a solution to the pair of equations?"),
        (10, "Pairs of linear equations", "Solve a pair of equations by graphing"),
        (10, "Pairs of linear equations", "Solve a pair of equations by graphing: word problems"),
        (10, "Pairs of linear equations", "Find the number of solutions to a pair of equations by graphing"),
        (10, "Pairs of linear equations", "Find the number of solutions to a pair of equations"),
        (10, "Pairs of linear equations", "Solve a pair of equations using substitution"),
        (10, "Pairs of linear equations", "Solve a pair of equations using substitution: word problems"),
        (10, "Pairs of linear equations", "Solve a pair of equations using elimination"),
        (10, "Pairs of linear equations", "Solve a pair of equations using elimination: word problems"),

        # Matrices
        (10, "Matrices", "Matrix vocabulary"),
        (10, "Matrices", "Matrix operation rules"),
        (10, "Matrices", "Add and subtract matrices"),
        (10, "Matrices", "Multiply a matrix by a scalar"),
        (10, "Matrices", "Multiply two matrices"),

        # Arithmetic sequences
        (10, "Arithmetic sequences", "Arithmetic sequences"),
        (10, "Arithmetic sequences", "Evaluate variable expressions for arithmetic sequences"),
        (10, "Arithmetic sequences", "Write variable expressions for arithmetic sequences"),
        (10, "Arithmetic sequences", "Partial sums of arithmetic series"),

        # Polynomials
        (10, "Polynomials", "Polynomial vocabulary"),
        (10, "Polynomials", "Model polynomials with algebra tiles"),
        (10, "Polynomials", "Add and subtract polynomials using algebra tiles"),
        (10, "Polynomials", "Add and subtract polynomials"),
        (10, "Polynomials", "Add polynomials to find perimeter"),
        (10, "Polynomials", "Multiply and divide monomials"),
        (10, "Polynomials", "Powers of monomials"),
        (10, "Polynomials", "Multiply a polynomial by a monomial"),
        (10, "Polynomials", "Multiply two polynomials using algebra tiles"),
        (10, "Polynomials", "Multiply two binomials"),
        (10, "Polynomials", "Multiply two binomials: special cases"),
        (10, "Polynomials", "Multiply polynomials"),

        # Factorising
        (10, "Factorising", "HCF of monomials"),
        (10, "Factorising", "Factorise out a monomial"),
        (10, "Factorising", "Factorise quadratics with leading coefficient 1"),
        (10, "Factorising", "Factorise quadratics with other leading coefficients"),
        (10, "Factorising", "Factorise quadratics: special cases"),
        (10, "Factorising", "Factorise quadratics using algebra tiles"),
        (10, "Factorising", "Factorise by grouping"),
        (10, "Factorising", "Factorise polynomials"),

        # Quadratic equations
        (10, "Quadratic equations", "Characteristics of quadratic equations"),
        (10, "Quadratic equations", "Complete a table: quadratic equations"),
        (10, "Quadratic equations", "Solve a quadratic equation using square roots"),
        (10, "Quadratic equations", "Solve a quadratic equation using the zero product property"),
        (10, "Quadratic equations", "Solve a quadratic equation by factorising"),
        (10, "Quadratic equations", "Complete the square"),
        (10, "Quadratic equations", "Solve a quadratic equation by completing the square"),
        (10, "Quadratic equations", "Solve a quadratic equation using the quadratic formula"),
        (10, "Quadratic equations", "Using the discriminant"),
        (10, "Quadratic equations", "Graph a quadratic equation"),
        (10, "Quadratic equations", "Match quadratic functions and graphs"),

        # Rational expressions
        (10, "Rational expressions", "Simplify complex fractions"),
        (10, "Rational expressions", "Simplify rational expressions"),
        (10, "Rational expressions", "Multiply and divide rational expressions"),
        (10, "Rational expressions", "Divide polynomials"),
        (10, "Rational expressions", "Add and subtract rational expressions"),
        (10, "Rational expressions", "Solve rational equations"),

        # Points, lines and segments
        (10, "Points, lines and segments", "Lines, line segments and half lines"),
        (10, "Points, lines and segments", "Lengths of segments on number lines"),
        (10, "Points, lines and segments", "Additive property of length"),
        (10, "Points, lines and segments", "Midpoints"),
        (10, "Points, lines and segments", "Congruent line segments"),
        (10, "Points, lines and segments", "Perpendicular Bisector Theorem"),
        (10, "Points, lines and segments", "Midpoint formula"),
        (10, "Points, lines and segments", "Distance formula"),

        # Two-dimensional figures
        (10, "Two-dimensional figures", "Polygon vocabulary"),
        (10, "Two-dimensional figures", "Perimeter"),
        (10, "Two-dimensional figures", "Area of triangles and quadrilaterals"),
        (10, "Two-dimensional figures", "Area and perimeter in the coordinate plane I"),
        (10, "Two-dimensional figures", "Area and perimeter in the coordinate plane II"),
        (10, "Two-dimensional figures", "Area and circumference of circles"),
        (10, "Two-dimensional figures", "Area of compound figures"),
        (10, "Two-dimensional figures", "Area between two shapes"),
        (10, "Two-dimensional figures", "Area and perimeter of similar figures"),

        # Transformations
        (10, "Transformations", "Translations: find the coordinates"),
        (10, "Transformations", "Reflections: find the coordinates"),
        (10, "Transformations", "Rotations: find the coordinates"),
        (10, "Transformations", "Congruence transformations"),
        (10, "Transformations", "Compositions of congruence transformations: graph the image"),
        (10, "Transformations", "Transformations that carry a polygon onto itself"),
        (10, "Transformations", "Dilations: graph the image"),
        (10, "Transformations", "Dilations: find the coordinates"),
        (10, "Transformations", "Dilations: scale factor and classification"),
        (10, "Transformations", "Dilations and parallel lines"),

        # Triangles
        (10, "Triangles", "Classify triangles"),
        (10, "Triangles", "Triangle Angle-Sum Theorem"),
        (10, "Triangles", "Midsegments of triangles"),
        (10, "Triangles", "Triangles and bisectors"),
        (10, "Triangles", "Identify medians, altitudes, angle bisectors and perpendicular bisectors"),
        (10, "Triangles", "Angle-side relationships in triangles"),
        (10, "Triangles", "Triangle Inequality Theorem"),

        # Similarity
        (10, "Similarity", "Identify similar figures"),
        (10, "Similarity", "Ratios in similar figures"),
        (10, "Similarity", "Similarity statements"),
        (10, "Similarity", "Side lengths and angle measures in similar figures"),
        (10, "Similarity", "Similar triangles and indirect measurement"),
        (10, "Similarity", "Perimeters of similar figures"),
        (10, "Similarity", "Similarity rules for triangles"),
        (10, "Similarity", "Similar triangles and similarity transformations"),
        (10, "Similarity", "Areas of similar figures"),

        # Right triangles
        (10, "Right triangles", "Pythagoras' Theorem"),
        (10, "Right triangles", "Converse of Pythagoras' theorem"),
        (10, "Right triangles", "Pythagoras' Inequality Theorems"),
        (10, "Right triangles", "Special right triangles"),

        # Circles
        (10, "Circles", "Parts of a circle"),
        (10, "Circles", "Central angles"),
        (10, "Circles", "Arc measure and arc length"),
        (10, "Circles", "Area of sectors"),
        (10, "Circles", "Circle measurements: mixed review"),
        (10, "Circles", "Arcs and chords"),
        (10, "Circles", "Tangent lines"),
        (10, "Circles", "Perimeter of polygons with an inscribed circle"),
        (10, "Circles", "Inscribed angles"),
        (10, "Circles", "Angles in inscribed right triangles"),
        (10, "Circles", "Angles in inscribed quadrilaterals"),

        # Trigonometry
        (10, "Trigonometry", "Trigonometric ratios: sin, cos and tan"),
        (10, "Trigonometry", "Trigonometric ratios: csc, sec and cot"),
        (10, "Trigonometry", "Trigonometric functions of complementary angles"),
        (10, "Trigonometry", "Find trigonometric functions of special angles"),
        (10, "Trigonometry", "Find trigonometric functions using a calculator"),
        (10, "Trigonometry", "Inverses of trigonometric functions"),
        (10, "Trigonometry", "Trigonometric ratios: find a side length"),
        (10, "Trigonometry", "Trigonometric ratios: find an angle measure"),
        (10, "Trigonometry", "Solve a right triangle"),

        # Surface area and volume
        (10, "Surface area and volume", "Introduction to surface area and volume"),
        (10, "Surface area and volume", "Surface area of prisms and cylinders"),
        (10, "Surface area and volume", "Surface area of cones"),
        (10, "Surface area and volume", "Volume of prisms and cylinders"),
        (10, "Surface area and volume", "Volume of cones"),
        (10, "Surface area and volume", "Surface area and volume of spheres"),
        (10, "Surface area and volume", "Introduction to similar solids"),
        (10, "Surface area and volume", "Surface area and volume of similar solids"),
        (10, "Surface area and volume", "Surface area and volume review"),

        # Measurement
        (10, "Measurement", "Convert rates and measurements"),
        (10, "Measurement", "Precision"),
        (10, "Measurement", "Greatest possible error"),
        (10, "Measurement", "Minimum and maximum area and volume"),
        (10, "Measurement", "Percent error"),
        (10, "Measurement", "Percent error: area and volume"),

        # Problem solving
        (10, "Problem solving", "Consecutive integer problems"),
        (10, "Problem solving", "Rate of travel: word problems"),
        (10, "Problem solving", "Weighted averages: word problems"),
        (10, "Problem solving", "Exponential growth and decay: word problems"),

        # Logic
        (10, "Logic", "Identify hypotheses and conclusions"),
        (10, "Logic", "Counterexamples"),
        (10, "Logic", "Truth tables"),
        (10, "Logic", "Truth values"),
        (10, "Logic", "Conditionals"),
        (10, "Logic", "Negations"),
        (10, "Logic", "Converses, inverses and contrapositives"),
        (10, "Logic", "Biconditionals"),

        # Probability
        (10, "Probability", "Theoretical probability"),
        (10, "Probability", "Experimental probability"),
        (10, "Probability", "Compound events: find the number of outcomes"),
        (10, "Probability", "Identify independent and dependent events"),
        (10, "Probability", "Probability of independent and dependent events"),
        (10, "Probability", "Geometric probability"),
        (10, "Probability", "Counting principle"),

        # Statistics
        (10, "Statistics", "Mean, median, mode and range"),
        (10, "Statistics", "Quartiles"),
        (10, "Statistics", "Identify biased samples"),

        # Data and graphs
        (10, "Data and graphs", "Interpret histograms"),
        (10, "Data and graphs", "Create histograms"),
        (10, "Data and graphs", "Interpret stem-and-leaf plots"),

        # Constructions
        (10, "Constructions", "Construct a tangent line to a circle"),
        (10, "Constructions", "Construct an equilateral triangle inscribed in a circle"),
        (10, "Constructions", "Construct a regular hexagon inscribed in a circle"),
        (10, "Constructions", "Construct the circumcenter or incenter of a triangle"),
        (10, "Constructions", "Construct the inscribed or circumscribed circle of a triangle"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class X maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class10_skills()
