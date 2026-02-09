"""
Cache manager for in-memory caching with TTL support.
Provides automatic cache invalidation on write operations.
"""
from functools import wraps
from typing import Any, Callable
from cachetools import TTLCache
import hashlib
import json

from app.core.config import settings

# Global cache instance with TTL
_cache = TTLCache(maxsize=settings.CACHE_MAX_SIZE, ttl=settings.CACHE_TTL)


def generate_cache_key(func_name: str, *args, **kwargs) -> str:
    """
    Generate a cache key from function name and arguments.
    
    Args:
        func_name: Name of the cached function
        *args: Positional arguments
        **kwargs: Keyword arguments
        
    Returns:
        MD5 hash of the function signature
    """
    # Create a stable string representation of the arguments
    key_data = {
        "function": func_name,
        "args": str(args),
        "kwargs": {k: str(v) for k, v in sorted(kwargs.items())}
    }
    key_string = json.dumps(key_data, sort_keys=True)
    return hashlib.md5(key_string.encode()).hexdigest()


def cached(key_prefix: str = ""):
    """
    Decorator for caching function results with TTL.
    
    Usage:
        @cached(key_prefix="skills")
        def get_skills(grade: int):
            return db.query(Skill).filter(Skill.grade == grade).all()
    
    Args:
        key_prefix: Optional prefix for cache keys (e.g., "skills", "questions")
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            # Skip cache if disabled
            if not settings.CACHE_ENABLED:
                return func(*args, **kwargs)
            
            # Generate cache key
            func_name = f"{key_prefix}:{func.__name__}" if key_prefix else func.__name__
            cache_key = generate_cache_key(func_name, *args, **kwargs)
            
            # Check if result is cached
            if cache_key in _cache:
                return _cache[cache_key]
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            _cache[cache_key] = result
            return result
        
        return wrapper
    return decorator


def invalidate_cache(key_prefix: str = None):
    """
    Clear cached entries, optionally filtered by key prefix.
    
    Args:
        key_prefix: If provided, only clear keys starting with this prefix.
                   If None, clear entire cache.
    
    Usage:
        # Clear all skills cache
        invalidate_cache("skills")
        
        # Clear entire cache
        invalidate_cache()
    """
    if key_prefix is None:
        _cache.clear()
    else:
        # Remove keys matching the prefix
        keys_to_remove = [k for k in _cache.keys() if k.startswith(key_prefix)]
        for key in keys_to_remove:
            del _cache[key]


def get_cache_stats() -> dict:
    """
    Get cache statistics.
    
    Returns:
        Dictionary with cache size, max size, and TTL
    """
    return {
        "current_size": len(_cache),
        "max_size": _cache.maxsize,
        "ttl_seconds": settings.CACHE_TTL,
        "enabled": settings.CACHE_ENABLED
    }
