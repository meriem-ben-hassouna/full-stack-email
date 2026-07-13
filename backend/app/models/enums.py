from enum import Enum


class Role(str, Enum):
    MANAGER = "MANAGER"
    EMPLOYEE = "EMPLOYEE"



class EmailStatus(str, Enum):
    DELIVERED = "delivered"
    PARTIAL = "partial"