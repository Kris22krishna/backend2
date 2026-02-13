"""
Test script to verify question template system functionality.
Run this after setting up the database to test the executor.
"""

from app.modules.questions.executor import QuestionExecutor, CodeExecutionError, CodeTimeoutError

# Test code samples
VALID_GENERATOR = """
def generate():
    import random
    a = random.randint(1, 20)
    b = random.randint(1, 20)
    return {
        'question': f'{a} + {b} = ?',
        'answer': str(a + b),
        'variables': {'a': a, 'b': b}
    }
"""

VALID_VALIDATOR = """
def validate(user_answer, correct_answer):
    return str(user_answer).strip() == str(correct_answer).strip()
"""

INVALID_CODE = """
def generate():
    import os  # This should fail - os not allowed
    return {'question': 'test', 'answer': 'test'}
"""

TIMEOUT_CODE = """
def generate():
    while True:  # Infinite loop - should timeout
        pass
    return {'question': 'test', 'answer': 'test'}
"""


def test_valid_generator():
    """Test that valid generator code executes successfully"""
    print("\\n=== Testing Valid Generator ===")
    executor = QuestionExecutor()
    
    try:
        result = executor.execute_generator(VALID_GENERATOR)
        print(f"✓ Success! Generated question: {result['question']}")
        print(f"  Answer: {result['answer']}")
        print(f"  Variables: {result.get('variables', {})}")
        return True
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False


def test_valid_validator():
    """Test that valid validator code executes successfully"""
    print("\\n=== Testing Valid Validator ===")
    executor = QuestionExecutor()
    
    try:
        result = executor.execute_validator(VALID_VALIDATOR, "23", "23")
        print(f"✓ Success! Validation result (should be True): {result}")
        
        result2 = executor.execute_validator(VALID_VALIDATOR, "23", "24")
        print(f"✓ Success! Validation result (should be False): {result2}")
        return True
    except Exception as e:
        print(f"✗ Failed: {e}")
        return False


def test_invalid_import():
    """Test that invalid imports are blocked"""
    print("\\n=== Testing Invalid Import (Security) ===")
    executor = QuestionExecutor()
    
    try:
        result = executor.execute_generator(INVALID_CODE)
        print(f"✗ Failed: Code should have been blocked but executed successfully")
        return False
    except CodeExecutionError as e:
        print(f"✓ Success! Code was blocked: {e}")
        return True
    except Exception as e:
        print(f"? Unexpected error: {e}")
        return False


def test_timeout():
    """Test that infinite loops are caught by timeout"""
    print("\\n=== Testing Timeout Protection ===")
    executor = QuestionExecutor()
    
    try:
        result = executor.execute_generator(TIMEOUT_CODE)
        print(f"✗ Failed: Code should have timed out but completed")
        return False
    except CodeTimeoutError as e:
        print(f"✓ Success! Code timed out as expected: {e}")
        return True
    except Exception as e:
        print(f"? Unexpected error: {e}")
        return False


def test_syntax_validation():
    """Test syntax validation"""
    print("\\n=== Testing Syntax Validation ===")
    executor = QuestionExecutor()
    
    invalid_syntax = "def generate(\n    return {'question': 'test'}"
    
    is_valid, error = executor.validate_code_syntax(invalid_syntax)
    if not is_valid:
        print(f"✓ Success! Invalid syntax detected: {error}")
        return True
    else:
        print(f"✗ Failed: Invalid syntax was not detected")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Question Template System - Executor Tests")
    print("=" * 60)
    
    tests = [
        ("Valid Generator", test_valid_generator),
        ("Valid Validator", test_valid_validator),
        ("Invalid Import (Security)", test_invalid_import),
        ("Timeout Protection", test_timeout),
        ("Syntax Validation", test_syntax_validation)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"\\n✗ Test '{name}' crashed: {e}")
            results.append((name, False))
    
    print("\\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {name}")
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    print(f"\\nTotal: {passed_count}/{total_count} tests passed")
    print("=" * 60)
