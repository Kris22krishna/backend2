"""
Script to insert Class I maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class1_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class I maths skills data
    skills_data = [
        # Counting and number patterns
        (1, "Counting and number patterns", "Counting review - up to 10"),
        (1, "Counting and number patterns", "Count to fill a ten frame"),
        (1, "Counting and number patterns", "Counting review - up to 20"),
        (1, "Counting and number patterns", "Counting tens and ones - up to 30"),
        (1, "Counting and number patterns", "Count on ten frames - up to 40"),
        (1, "Counting and number patterns", "Counting - up to 100"),
        (1, "Counting and number patterns", "Counting tens and ones - up to 99"),
        (1, "Counting and number patterns", "Counting by twos, fives and tens with pictures"),
        (1, "Counting and number patterns", "Counting by twos, fives and tens"),
        (1, "Counting and number patterns", "Counting forward and backward"),
        (1, "Counting and number patterns", "Number lines - up to 100"),
        (1, "Counting and number patterns", "Hundred chart"),
        (1, "Counting and number patterns", "Even or odd"),
        (1, "Counting and number patterns", "Identify numbers as even or odd"),
        (1, "Counting and number patterns", "Even or odd numbers on number lines"),
        (1, "Counting and number patterns", "Which even or odd number comes before or after?"),
        (1, "Counting and number patterns", "Skip-counting patterns - with tables"),
        (1, "Counting and number patterns", "Sequences - count up and down by 1, 2, 3, 5 and 10"),
        (1, "Counting and number patterns", "Sequences - count up and down by 100"),
        (1, "Counting and number patterns", "Ordinal numbers"),
        (1, "Counting and number patterns", "Writing numbers in words"),
        
        # Place values
        (1, "Place values", "Place value models - tens and ones"),
        (1, "Place values", "Place value models - up to hundreds"),
        (1, "Place values", "Write tens and ones - up to 30"),
        (1, "Place values", "Write tens and ones - up to 100"),
        
        # Understand addition
        (1, "Understand addition", "Add with pictures - sums up to 10"),
        (1, "Understand addition", "Addition sentences - sums up to 10"),
        (1, "Understand addition", "Addition sentences using number lines - sums up to 10"),
        (1, "Understand addition", "Adding zero"),
        
        # Addition skill builders
        (1, "Addition skill builders", "Adding 1"),
        (1, "Addition skill builders", "Adding 2"),
        (1, "Addition skill builders", "Adding 3"),
        (1, "Addition skill builders", "Adding 4"),
        (1, "Addition skill builders", "Adding 5"),
        (1, "Addition skill builders", "Adding 6"),
        (1, "Addition skill builders", "Adding 7"),
        (1, "Addition skill builders", "Adding 8"),
        (1, "Addition skill builders", "Adding 9"),
        (1, "Addition skill builders", "Adding 0"),
        
        # Addition
        (1, "Addition", "Addition facts - sums up to 10"),
        (1, "Addition", "Ways to make a number - addition sentences"),
        (1, "Addition", "Make a number using addition - sums up to 10"),
        (1, "Addition", "Complete the addition sentence - sums up to 10"),
        (1, "Addition", "Addition word problems - sums up to 10"),
        (1, "Addition", "Addition sentences for word problems - sums up to 10"),
        (1, "Addition", "Addition facts - sums up to 18"),
        (1, "Addition", "Addition sentences using number lines - sums up to 18"),
        (1, "Addition", "Addition word problems - sums up to 18"),
        (1, "Addition", "Addition sentences for word problems - sums up to 18"),
        (1, "Addition", "Addition facts - sums up to 20"),
        (1, "Addition", "Make a number using addition - sums up to 20"),
        (1, "Addition", "Addition sentences for word problems - sums up to 20"),
        (1, "Addition", "Related addition facts"),
        (1, "Addition", "Addition sentences: true or false?"),
        (1, "Addition", "Add a one-digit number to a two-digit number - without regrouping"),
        (1, "Addition", "Add a one-digit number to a two-digit number - with regrouping"),
        
        # Addition strategies
        (1, "Addition strategies", "Add doubles"),
        (1, "Addition strategies", "Add using doubles plus one"),
        (1, "Addition strategies", "Add using doubles minus one"),
        (1, "Addition strategies", "Add three numbers - use doubles"),
        (1, "Addition strategies", "Complete the addition sentence - make ten"),
        (1, "Addition strategies", "Add three numbers - make ten"),
        (1, "Addition strategies", "Add two multiples of ten"),
        (1, "Addition strategies", "Add a multiple of ten"),
        (1, "Addition strategies", "Add three numbers"),
        (1, "Addition strategies", "Add three numbers - word problems"),
        
        # Understand subtraction
        (1, "Understand subtraction", "Subtract with pictures - numbers up to 10"),
        (1, "Understand subtraction", "Subtraction sentences - numbers up to 10"),
        (1, "Understand subtraction", "Subtraction sentences using number lines - numbers up to 10"),
        (1, "Understand subtraction", "Subtract zero and all"),
        
        # Subtraction skill builders
        (1, "Subtraction skill builders", "Subtracting 1"),
        (1, "Subtraction skill builders", "Subtracting 2"),
        (1, "Subtraction skill builders", "Subtracting 3"),
        (1, "Subtraction skill builders", "Subtracting 4"),
        (1, "Subtraction skill builders", "Subtracting 5"),
        (1, "Subtraction skill builders", "Subtracting 6"),
        (1, "Subtraction skill builders", "Subtracting 7"),
        (1, "Subtraction skill builders", "Subtracting 8"),
        (1, "Subtraction skill builders", "Subtracting 9"),
        (1, "Subtraction skill builders", "Subtracting 0"),
        
        # Subtraction
        (1, "Subtraction", "Subtraction facts - numbers up to 10"),
        (1, "Subtraction", "Ways to make a number - subtraction sentences"),
        (1, "Subtraction", "Ways to subtract from a number - subtraction sentences"),
        (1, "Subtraction", "Make a number using subtraction - numbers up to 10"),
        (1, "Subtraction", "Complete the subtraction sentence"),
        (1, "Subtraction", "Subtraction word problems - numbers up to 10"),
        (1, "Subtraction", "Subtraction sentences for word problems - numbers up to 10"),
        (1, "Subtraction", "Subtraction facts - numbers up to 18"),
        (1, "Subtraction", "Subtraction sentences using number lines - numbers up to 18"),
        (1, "Subtraction", "Subtraction word problems - numbers up to 18"),
        (1, "Subtraction", "Subtraction sentences for word problems - numbers up to 18"),
        (1, "Subtraction", "Make a number using subtraction - numbers up to 20"),
        (1, "Subtraction", "Related subtraction facts"),
        (1, "Subtraction", "Subtraction sentences: true or false?"),
        (1, "Subtraction", "Subtract a one-digit number from a two-digit number - without regrouping"),
        (1, "Subtraction", "Subtract a one-digit number from a two-digit number - with regrouping"),
        
        # Subtraction strategies
        (1, "Subtraction strategies", "Relate addition and subtraction sentences"),
        (1, "Subtraction strategies", "Subtract doubles"),
        (1, "Subtraction strategies", "Subtract multiples of 10"),
        (1, "Subtraction strategies", "Subtract a multiple of 10"),
        
        # Comparing
        (1, "Comparing", "Comparing - review"),
        (1, "Comparing", "Comparing numbers up to 10"),
        (1, "Comparing", "Comparing numbers up to 100"),
        (1, "Comparing", "Comparison word problems"),
        
        # Estimation
        (1, "Estimation", "Estimate to the nearest ten"),
        
        # Two-dimensional shapes
        (1, "Two-dimensional shapes", "Name the two-dimensional shape"),
        (1, "Two-dimensional shapes", "Select two-dimensional shapes"),
        (1, "Two-dimensional shapes", "Count sides and vertices"),
        (1, "Two-dimensional shapes", "Compare sides and vertices"),
        (1, "Two-dimensional shapes", "Open and closed shapes"),
        (1, "Two-dimensional shapes", "Flip, turn and slide"),
        (1, "Two-dimensional shapes", "Symmetry"),
        
        # Three-dimensional shapes
        (1, "Three-dimensional shapes", "Two-dimensional and three-dimensional shapes"),
        (1, "Three-dimensional shapes", "Name the three-dimensional shape"),
        (1, "Three-dimensional shapes", "Cubes and rectangular prisms"),
        (1, "Three-dimensional shapes", "Select three-dimensional shapes"),
        (1, "Three-dimensional shapes", "Count vertices, edges and faces"),
        (1, "Three-dimensional shapes", "Compare vertices, edges and faces"),
        (1, "Three-dimensional shapes", "Identify shapes traced from solids"),
        (1, "Three-dimensional shapes", "Identify faces of three-dimensional shapes"),
        (1, "Three-dimensional shapes", "Shapes of everyday objects I"),
        (1, "Three-dimensional shapes", "Shapes of everyday objects II"),
        
        # Spatial sense
        (1, "Spatial sense", "Above and below"),
        (1, "Spatial sense", "Beside and next to"),
        (1, "Spatial sense", "Left, middle and right"),
        (1, "Spatial sense", "Top, middle and bottom"),
        (1, "Spatial sense", "Location in a grid"),
        
        # Data and graphs
        (1, "Data and graphs", "Which pictograph is correct?"),
        (1, "Data and graphs", "Interpret pictographs"),
        (1, "Data and graphs", "Which tally chart is correct?"),
        (1, "Data and graphs", "Interpret tally charts"),
        (1, "Data and graphs", "Record data in tables"),
        (1, "Data and graphs", "Interpret data in tables"),
        
        # Measurement
        (1, "Measurement", "Long and short"),
        (1, "Measurement", "Tall and short"),
        (1, "Measurement", "Light and heavy"),
        (1, "Measurement", "Compare size and weight"),
        
        # Money
        (1, "Money", "Coin values"),
        (1, "Money", "Count coins"),
        (1, "Money", "Count notes"),
        
        # Patterns
        (1, "Patterns", "Introduction to patterns"),
        (1, "Patterns", "Find the next shape in a pattern"),
        (1, "Patterns", "Complete a pattern"),
        (1, "Patterns", "Make a pattern"),
        (1, "Patterns", "Growing patterns"),
        (1, "Patterns", "Find the next shape in a growing pattern"),
        (1, "Patterns", "Find the next row in a growing pattern"),
        
        # Probability
        (1, "Probability", "More, less and equally likely"),
        (1, "Probability", "Certain, probable, unlikely and impossible"),
        
        # Sorting, ordering and classifying
        (1, "Sorting, ordering and classifying", "Sort shapes into a Venn diagram"),
        (1, "Sorting, ordering and classifying", "Count shapes in a Venn diagram"),
        (1, "Sorting, ordering and classifying", "Put numbers in order"),
        
        # Time
        (1, "Time", "Days of the week"),
        (1, "Time", "Seasons of the year"),
        (1, "Time", "Read a calendar"),
        (1, "Time", "Months of the year"),
        (1, "Time", "A.M. or P.M."),
        
        # Mixed operations
        (1, "Mixed operations", "Addition and subtraction - ways to make a number"),
        (1, "Mixed operations", "Which sign makes the number sentence true?"),
        (1, "Mixed operations", "Fact families"),
        (1, "Mixed operations", "Addition and subtraction facts - numbers up to 10"),
        (1, "Mixed operations", "Addition and subtraction facts - numbers up to 18"),
        (1, "Mixed operations", "Addition and subtraction word problems"),
        (1, "Mixed operations", "Addition and subtraction terms"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class I maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class1_skills()
