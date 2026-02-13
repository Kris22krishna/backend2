from dataclasses import dataclass

@dataclass
class RequestContext:
    user_id: str
    tenant_id: str
