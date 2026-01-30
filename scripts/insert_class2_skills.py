"""
Script to insert Class II maths skills into the skills table.
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def insert_class2_skills():
    engine = create_engine(settings.DATABASE_URL)
    
    # Class II maths skills data
    skills_data = [
        # Counting and number patterns
        (2, "Counting and number patterns", "Skip-counting"),
        (2, "Counting and number patterns", "Skip-counting sequences"),
        (2, "Counting and number patterns", "Counting patterns - up to 100"),
        (2, "Counting and number patterns", "Number lines - up to 100"),
        (2, "Counting and number patterns", "Hundred chart"),
        (2, "Counting and number patterns", "Even or odd"),
        (2, "Counting and number patterns", "Identify numbers as even or odd"),
        (2, "Counting and number patterns", "Select even or odd numbers"),
        (2, "Counting and number patterns", "Even or odd numbers on number lines"),
        (2, "Counting and number patterns", "Which even or odd number comes before or after?"),
        (2, "Counting and number patterns", "Skip-counting stories"),
        (2, "Counting and number patterns", "Skip-counting puzzles"),

        # Comparing and ordering
        (2, "Comparing and ordering", "Comparing numbers up to 100"),
        (2, "Comparing and ordering", "Put numbers up to 100 in order"),
        (2, "Comparing and ordering", "Greatest and least - word problems - up to 100"),

        # Names of numbers
        (2, "Names of numbers", "Ordinal numbers up to 10th"),
        (2, "Names of numbers", "Ordinal numbers up to 100th"),
        (2, "Names of numbers", "Writing numbers up to 100 in words"),
        (2, "Names of numbers", "Distinguishing ordinal and cardinal numbers"),

        # Patterns
        (2, "Patterns", "Repeating patterns"),
        (2, "Patterns", "Growing patterns"),
        (2, "Patterns", "Find the next shape in a pattern"),
        (2, "Patterns", "Complete a repeating pattern"),
        (2, "Patterns", "Make a repeating pattern"),
        (2, "Patterns", "Find the next row in a growing pattern"),

        # Addition - one digit
        (2, "Addition - one digit", "Review - add one-digit numbers - sums to 10"),
        (2, "Addition - one digit", "Review - ways to make a number - sums to 10"),
        (2, "Addition - one digit", "Review - writing addition sentences - sums to 10"),
        (2, "Addition - one digit", "Add doubles"),
        (2, "Addition - one digit", "Add one-digit numbers"),
        (2, "Addition - one digit", "Addition with pictures - sums to 20"),
        (2, "Addition - one digit", "Write addition sentences to describe pictures - sums to 20"),
        (2, "Addition - one digit", "Addition input/output tables - sums to 20"),
        (2, "Addition - one digit", "Add zero"),
        (2, "Addition - one digit", "Addition word problems - one digit"),
        (2, "Addition - one digit", "Complete the addition sentence - one digit"),
        (2, "Addition - one digit", "Write the addition sentence - one digit"),
        (2, "Addition - one digit", "Balance addition equations - one digit"),
        (2, "Addition - one digit", "Add three or more one-digit numbers"),
        (2, "Addition - one digit", "Add three or more one-digit numbers - word problems"),
        (2, "Addition - one digit", "Identify repeated addition for arrays - sums to 10"),
        (2, "Addition - one digit", "Write addition sentences for arrays - sums to 10"),
        (2, "Addition - one digit", "Identify repeated addition for arrays - sums to 25"),
        (2, "Addition - one digit", "Write addition sentences for arrays - sums to 25"),

        # Subtraction - one digit
        (2, "Subtraction - one digit", "Review - subtract one-digit numbers - up to 10"),
        (2, "Subtraction - one digit", "Review - ways to subtract - up to 10"),
        (2, "Subtraction - one digit", "Review - writing subtraction sentences - up to 10"),
        (2, "Subtraction - one digit", "Subtract doubles"),
        (2, "Subtraction - one digit", "Subtract a one-digit number from a two-digit number up to 18"),
        (2, "Subtraction - one digit", "Subtraction with pictures"),
        (2, "Subtraction - one digit", "Write subtraction sentences to describe pictures - up to 18"),
        (2, "Subtraction - one digit", "Subtraction input/output tables - up to 18"),
        (2, "Subtraction - one digit", "Subtract zero/all"),
        (2, "Subtraction - one digit", "Subtraction word problems - up to 18"),
        (2, "Subtraction - one digit", "Complete the subtraction sentence - up to 18"),
        (2, "Subtraction - one digit", "Write the subtraction sentence - up to 18"),
        (2, "Subtraction - one digit", "Balance subtraction equations - up to 18"),

        # Addition - two digits
        (2, "Addition - two digits", "Add multiples of 10"),
        (2, "Addition - two digits", "Add a two-digit and a one-digit number - without regrouping"),
        (2, "Addition - two digits", "Add a two-digit and a one-digit number - with regrouping"),
        (2, "Addition - two digits", "Add two two-digit numbers - without regrouping"),
        (2, "Addition - two digits", "Add two two-digit numbers - with regrouping"),
        (2, "Addition - two digits", "Write addition sentences to describe pictures"),
        (2, "Addition - two digits", "Addition input/output tables - up to two digits"),
        (2, "Addition - two digits", "Ways to make a number using addition"),
        (2, "Addition - two digits", "Addition word problems - up to two digits"),
        (2, "Addition - two digits", "Complete the addition sentence - up to two digits"),
        (2, "Addition - two digits", "Write the addition sentence - up to two digits"),
        (2, "Addition - two digits", "Balance addition equations - up to two digits"),
        (2, "Addition - two digits", "Add three or more numbers up to two digits each"),
        (2, "Addition - two digits", "Add three or more numbers up to two digits - word problems"),

        # Subtraction - two digits
        (2, "Subtraction - two digits", "Subtract multiples of 10"),
        (2, "Subtraction - two digits", "Subtract a one-digit number from a two-digit number - without regrouping"),
        (2, "Subtraction - two digits", "Subtract a one-digit number from a two-digit number - with regrouping"),
        (2, "Subtraction - two digits", "Subtract two two-digit numbers - without regrouping"),
        (2, "Subtraction - two digits", "Subtract two two-digit numbers - with regrouping"),
        (2, "Subtraction - two digits", "Write subtraction sentences to describe pictures - up to two digits"),
        (2, "Subtraction - two digits", "Subtraction input/output tables - up to two digits"),
        (2, "Subtraction - two digits", "Ways to make a number using subtraction"),
        (2, "Subtraction - two digits", "Subtraction word problems - up to two digits"),
        (2, "Subtraction - two digits", "Complete the subtraction sentence - up to two digits"),
        (2, "Subtraction - two digits", "Write the subtraction sentence - up to two digits"),
        (2, "Subtraction - two digits", "Balance subtraction equations - up to two digits"),

        # Properties
        (2, "Properties", "Related addition facts"),
        (2, "Properties", "Related subtraction facts"),
        (2, "Properties", "Fact families"),
        (2, "Properties", "Addition and subtraction terms"),

        # Place values
        (2, "Place values", "Place value models - tens and ones"),
        (2, "Place values", "Value of a digit - tens and ones"),
        (2, "Place values", "Regroup tens and ones"),
        (2, "Place values", "Regroup tens and ones - ways to make a number"),
        (2, "Place values", "Convert to/from a number - tens and ones"),
        (2, "Place values", "Convert between place values - tens and ones"),

        # Estimation and rounding
        (2, "Estimation and rounding", "Estimate to the nearest ten"),
        (2, "Estimation and rounding", "Round to the nearest ten"),
        (2, "Estimation and rounding", "Estimate sums"),

        # Money
        (2, "Money", "Coin values"),
        (2, "Money", "Count money - up to 10 rupees"),
        (2, "Money", "Count money - up to 50 rupees"),
        (2, "Money", "Equivalent amounts of money - up to 10 rupees"),
        (2, "Money", "Equivalent amounts of money - up to 50 rupees"),
        (2, "Money", "Exchanging coins"),
        (2, "Money", "Comparing groups of coins"),
        (2, "Money", "Add and subtract money - word problems - up to 10 rupees"),
        (2, "Money", "Which picture shows more - up to 10 rupees"),
        (2, "Money", "Which picture shows more - up to 50 rupees"),
        (2, "Money", "Least number of coins"),
        (2, "Money", "Purchases - do you have enough money - up to 10 rupees"),
        (2, "Money", "Purchases - do you have enough money - up to 50 rupees"),
        (2, "Money", "Making change"),

        # Time
        (2, "Time", "Days of the week"),
        (2, "Time", "Seasons"),
        (2, "Time", "Read a calendar"),
        (2, "Time", "Months of the year"),
        (2, "Time", "Number of days in each month"),
        (2, "Time", "Relate time units"),
        (2, "Time", "A.M. or P.M."),

        # Data and graphs
        (2, "Data and graphs", "Which tally chart is correct?"),
        (2, "Data and graphs", "Interpret tally charts"),

        # Geometry
        (2, "Geometry", "Name the two-dimensional shape"),
        (2, "Geometry", "Select two-dimensional shapes"),
        (2, "Geometry", "Count sides and vertices"),
        (2, "Geometry", "Compare sides and vertices"),
        (2, "Geometry", "Name the three-dimensional shape"),
        (2, "Geometry", "Select three-dimensional shapes"),
        (2, "Geometry", "Count vertices, edges and faces"),
        (2, "Geometry", "Compare vertices, edges and faces"),
        (2, "Geometry", "Flip, turn and slide"),

        # Measurement
        (2, "Measurement", "Long and short"),
        (2, "Measurement", "Tall and short"),
        (2, "Measurement", "Light and heavy"),
        (2, "Measurement", "Holds more or less"),
        (2, "Measurement", "Compare size, weight and capacity"),
        (2, "Measurement", "Choose the appropriate measuring tool"),
        (2, "Measurement", "Measure using objects"),
        (2, "Measurement", "Measure using a centimetre ruler"),

        # Logical reasoning
        (2, "Logical reasoning", "Guess the number"),

        # Probability
        (2, "Probability", "More, less and equally likely"),
        (2, "Probability", "Certain, probable, unlikely and impossible"),

        # Mixed operations
        (2, "Mixed operations", "Add and subtract numbers up to 20"),
        (2, "Mixed operations", "Addition and subtraction - ways to make a number - up to 20"),
        (2, "Mixed operations", "Addition and subtraction word problems - up to 20"),
        (2, "Mixed operations", "Addition and subtraction - balance equations - up to 20"),
        (2, "Mixed operations", "Write the addition or subtraction rule for an input/output table - up to 20"),
        (2, "Mixed operations", "Add and subtract numbers up to 100"),
        (2, "Mixed operations", "Addition and subtraction - ways to make a number - up to 100"),
        (2, "Mixed operations", "Addition and subtraction word problems - up to 100"),
        (2, "Mixed operations", "Addition and subtraction - balance equations - up to 100"),
        (2, "Mixed operations", "Write the addition or subtraction rule for an input/output table - up to 100"),
        (2, "Mixed operations", "Which sign (+ or -) makes the number sentence true? - up to 100"),
        (2, "Mixed operations", "Write addition and subtraction sentences"),
    ]
    
    with engine.connect() as conn:
        print(f"Inserting {len(skills_data)} Class II maths skills...")
        
        for grade, topic, skill_name in skills_data:
            conn.execute(
                text("INSERT INTO skills (grade, topic, skill_name) VALUES (:grade, :topic, :skill_name)"),
                {"grade": grade, "topic": topic, "skill_name": skill_name}
            )
        
        conn.commit()
        print(f"Successfully inserted {len(skills_data)} skills!")

if __name__ == "__main__":
    insert_class2_skills()
