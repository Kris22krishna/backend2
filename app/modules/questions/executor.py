"""
Safe code execution engine for question templates.
Uses RestrictedPython to execute user-provided code in a sandboxed environment.
"""

from RestrictedPython import compile_restricted
from RestrictedPython.Guards import safe_builtins, guarded_iter_unpack_sequence
import random
import math
import threading
from typing import Dict, Any, Tuple


class CodeExecutionError(Exception):
    """Raised when code execution fails"""
    pass


class CodeTimeoutError(CodeExecutionError):
    """Raised when code execution exceeds timeout"""
    pass


class QuestionExecutor:
    """
    Safely execute question template code.
    
    Security measures:
    - RestrictedPython compilation
    - 5-second execution timeout
    - Only random and math modules allowed
    - No file system or network access
    - Comprehensive guards for safe operations
    """
    
    TIMEOUT_SECONDS = 5
    ALLOWED_MODULES = {
        'random': random,
        'math': math
    }
    
    # Safe built-in functions that are allowed
    SAFE_BUILTINS = {
        'len': len,
        'str': str,
        'int': int,
        'float': float,
        'bool': bool,
        'list': list,
        'dict': dict,
        'tuple': tuple,
        'set': set,
        'range': range,
        'enumerate': enumerate,
        'zip': zip,
        'map': map,
        'filter': filter,
        'sum': sum,
        'min': min,
        'max': max,
        'abs': abs,
        'round': round,
        'sorted': sorted,
        'reversed': reversed,
        'any': any,
        'all': all,
        'isinstance': isinstance,
        'type': type,
        'getattr': getattr,
        'hasattr': hasattr,
        'chr': chr,
        'ord': ord,
        'format': format,
        'True': True,
        'False': False,
        'None': None,
    }
    
    def _run_with_timeout(self, func, timeout_seconds):
        """Run a function with timeout using threading"""
        result = {'value': None, 'error': None}
        
        def target():
            try:
                result['value'] = func()
            except Exception as e:
                result['error'] = e
        
        thread = threading.Thread(target=target)
        thread.daemon = True
        thread.start()
        thread.join(timeout_seconds)
        
        if thread.is_alive():
            # Thread is still running - timeout occurred
            raise CodeTimeoutError(f"Code execution exceeded {timeout_seconds} second limit")
        
        if result['error']:
            raise result['error']
        
        return result['value']
    
    def validate_code_syntax(self, code: str) -> Tuple[bool, str]:
        """
        Validate Python code syntax without executing.
        
        Returns:
            (is_valid, error_message)
        """
        try:
            compile_restricted(code, '<string>', 'exec')
            return True, ""
        except SyntaxError as e:
            return False, f"Syntax error: {str(e)}"
        except Exception as e:
            return False, f"Compilation error: {str(e)}"
    
    def _create_safe_globals(self):
        """Create a safe global environment with all necessary guards"""
        
        def safe_import(name, *args, **kwargs):
            """Only allow importing specific modules"""
            if name in self.ALLOWED_MODULES:
                return self.ALLOWED_MODULES[name]
            raise ImportError(f"Import of '{name}' is not allowed")
        
        def safe_getitem(obj, index):
            """Safe getitem for indexing operations"""
            return obj[index]
        
        def safe_getattr(obj, name, default=None):
            """Safe getattr for attribute access"""
            return getattr(obj, name, default)
        
        def safe_iter(obj):
            """Safe iteration"""
            return iter(obj)
        
        def safe_inplacevar(op, x, y):
            """Safe in-place operations like +=, -=, *=, etc."""
            if op == '+=':
                return x + y
            elif op == '-=':
                return x - y
            elif op == '*=':
                return x * y
            elif op == '/=':
                return x / y
            elif op == '//=':
                return x // y
            elif op == '%=':
                return x % y
            elif op == '**=':
                return x ** y
            else:
                raise ValueError(f"Unsupported in-place operation: {op}")
        
        # Comprehensive safe globals
        safe_globals = {
            '__builtins__': {
                **safe_builtins,
                **self.SAFE_BUILTINS,
                '__import__': safe_import,
                '_getattr_': safe_getattr,
                '_getitem_': safe_getitem,
                '_getiter_': safe_iter,
                '_iter_unpack_sequence_': guarded_iter_unpack_sequence,
                '_unpack_sequence_': guarded_iter_unpack_sequence,
                '_inplacevar_': safe_inplacevar,
                # Allow write operations for lists/dicts
                '_write_': lambda x: x,
                '_apply_': lambda f, *args, **kwargs: f(*args, **kwargs),
            },
            **self.ALLOWED_MODULES
        }
        
        return safe_globals
    
    
    def execute_sequential(self, scripts: list[str]) -> Dict[str, Any]:
        """
        Execute a sequence of scripts in the same safe global environment.
        Useful for v2 generation where question, answer, and solution are separate scripts 
        sharing the same variables.
        
        Args:
            scripts: List of Python code strings to execute in order
            
        Returns:
            Dict with 'question', 'answer', 'solution' and other metadata
        """
        # Validate all scripts first
        for i, code in enumerate(scripts):
            if not code.strip():
                continue
            is_valid, error = self.validate_code_syntax(code)
            if not is_valid:
                raise CodeExecutionError(f"Syntax error in script {i+1}: {error}")
        
        # Prepare safe execution environment
        safe_globals = self._create_safe_globals()
        
        # Add a specific function to allow scripts to explicitly export data if they want
        # though we will mostly rely on checking globals
        output_data = {}
        
        def execute_all():
            for code in scripts:
                if not code.strip():
                    continue
                    
                try:
                    byte_code = compile_restricted(code, '<script>', 'exec')
                    exec(byte_code, safe_globals)
                except Exception as e:
                    raise CodeExecutionError(f"Execution error: {str(e)}")
            
            # Extract results from globals
            # We look for specific variable names that the scripts should set
            # Or specialized functions provided by the v2 format
            
            # Standard fields request by v2
            result = {
                'question': safe_globals.get('question'),
                'answer': safe_globals.get('answer'),
                'solution': safe_globals.get('solution'),
                'options': safe_globals.get('options'),
                'type': safe_globals.get('type'),
                'topic': safe_globals.get('topic'),
                'variables': safe_globals.get('variables', {})
            }
            
            # If standard variables aren't set, checks if they return JSX/String from last expression? 
            # No, `exec` doesn't return value. Current requirement is to setting variables.
            # We can support an explicit `generate()` like v1, but sequential scripts usually imply top-level execution.
            
            # Helper: If question is missing, check if 'question_text' or similar exists, or maybe they just set 'output'
            
            # Clean up None values
            return {k: v for k, v in result.items() if v is not None}

        try:
            return self._run_with_timeout(execute_all, self.TIMEOUT_SECONDS)
        except CodeTimeoutError:
            raise
        except CodeExecutionError:
            raise
        except Exception as e:
            raise CodeExecutionError(f"Sequential execution error: {str(e)}")

    def execute_generator(self, code: str) -> Dict[str, Any]:
        """
        Execute dynamic_question code to generate a question.
        
        Args:
            code: Python code defining a generate() function
            
        Returns:
            Dict with 'question', 'answer', and optionally 'variables', 'options', 'type'
            
        Raises:
            CodeExecutionError: If execution fails
            CodeTimeoutError: If execution times out
        """
        # Validate syntax first
        is_valid, error = self.validate_code_syntax(code)
        if not is_valid:
            raise CodeExecutionError(error)
        
        # Compile with restrictions
        try:
            byte_code = compile_restricted(code, '<generator>', 'exec')
        except Exception as e:
            raise CodeExecutionError(f"Failed to compile code: {str(e)}")
        
        # Prepare safe execution environment
        safe_globals = self._create_safe_globals()
        
        # Execute with timeout
        def execute():
            exec(byte_code, safe_globals)
            
            # Check for explicit generate() function
            if 'generate' in safe_globals and callable(safe_globals['generate']):
                result = safe_globals['generate']()
            else:
                # Fallback: check for implicit result in global variables
                # This supports simple top-level scripts that just set variables
                if 'question' in safe_globals and 'answer' in safe_globals:
                    result = {
                        'question': safe_globals['question'],
                        'answer': safe_globals['answer'],
                        'variables': safe_globals.get('variables', {}),
                        'options': safe_globals.get('options'),
                        'type': safe_globals.get('type'),
                        'topic': safe_globals.get('topic')
                    }
                    # Clean up None values
                    result = {k: v for k, v in result.items() if v is not None}
                else:
                    raise CodeExecutionError("Code must define a 'generate()' function OR set 'question' and 'answer' variables")
            
            # Validate output structure
            self._validate_generator_output(result)
            
            return result
        
        try:
            return self._run_with_timeout(execute, self.TIMEOUT_SECONDS)
        except CodeTimeoutError:
            raise
        except CodeExecutionError:
            raise
        except Exception as e:
            raise CodeExecutionError(f"Execution error: {str(e)}")
    
    def execute_validator(self, code: str, user_answer: Any, correct_answer: Any) -> bool:
        """
        Execute logical_answer code to validate a student's answer.
        
        Args:
            code: Python code defining a validate() function
            user_answer: Student's submitted answer
            correct_answer: Correct answer from question generation
            
        Returns:
            True if answer is correct, False otherwise
            
        Raises:
            CodeExecutionError: If execution fails
            CodeTimeoutError: If execution times out
        """
        # Validate syntax first
        is_valid, error = self.validate_code_syntax(code)
        if not is_valid:
            raise CodeExecutionError(error)
        
        # Compile with restrictions
        try:
            byte_code = compile_restricted(code, '<validator>', 'exec')
        except Exception as e:
            raise CodeExecutionError(f"Failed to compile code: {str(e)}")
        
        # Prepare safe execution environment
        safe_globals = self._create_safe_globals()
        
        # Execute with timeout
        def execute():
            exec(byte_code, safe_globals)
            
            # Verify validate function exists
            if 'validate' not in safe_globals:
                raise CodeExecutionError("Code must define a 'validate()' function")
            
            # Call validate function
            result = safe_globals['validate'](user_answer, correct_answer)
            return bool(result)
        
        try:
            return self._run_with_timeout(execute, self.TIMEOUT_SECONDS)
        except CodeTimeoutError:
            raise
        except CodeExecutionError:
            raise
        except Exception as e:
            raise CodeExecutionError(f"Validation error: {str(e)}")
    
    def _validate_generator_output(self, output: Any):
        """Validate that generator output has required structure"""
        if not isinstance(output, dict):
            raise CodeExecutionError("generate() must return a dictionary")
        
        # Required fields
        required_fields = ['question', 'answer']
        for field in required_fields:
            if field not in output:
                raise CodeExecutionError(f"Missing required field in output: '{field}'")
        
        # Validate question field
        if not isinstance(output['question'], str):
            raise CodeExecutionError("'question' field must be a string")
        
        # Validate answer field (can be string or number)
        if not isinstance(output['answer'], (str, int, float)):
            raise CodeExecutionError("'answer' field must be a string or number")
        
        # Optional fields validation
        if 'options' in output:
            if not isinstance(output['options'], list):
                raise CodeExecutionError("'options' field must be a list")
        
        if 'type' in output:
            if output['type'] not in ['mcq', 'user_input', 'userInput', 'image_based', 'code_based']:
                raise CodeExecutionError(f"Invalid question type: {output['type']}")


# Global executor instance
executor = QuestionExecutor()
