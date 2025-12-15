
from pydantic import BaseModel, EmailStr, constr, Field
from datetime import date, time
from typing import Optional


class UserRegistration(BaseModel):
    username: constr(min_length=3, max_length=50)
    email: EmailStr
    password: constr(min_length=4)
    role: constr(min_length=3, max_length=20)



class StudentRegistration(BaseModel):
        name: constr(min_length=1, max_length=100)
        email: EmailStr
        dob: constr(min_length=4, max_length=20)
        current_year: constr(min_length=1, max_length=10)
        program: constr(min_length=1, max_length=100)
        profile_image: str = ""
        bio: str = ""

class FacultyRegistration(BaseModel):
    name: constr(min_length=1, max_length=100)
    email: EmailStr
    title: constr(min_length=1, max_length=50)
    department: constr(min_length=1, max_length=50)
    profile_image: str = ""
    bio: str = ""
    phone: constr(min_length=10, max_length=15) = ""
    office_location: str = ""
from pydantic import BaseModel, EmailStr, constr, validator
from typing import Optional

class FacultyOut(BaseModel):
    name: constr(min_length=1, max_length=100)
    email: Optional[str]  # <-- changed from EmailStr to str and optional
    title: constr(min_length=1, max_length=50)
    department: constr(min_length=1, max_length=50)
    profile_image: Optional[str] = ""
    bio: Optional[str] = ""
    phone: Optional[str] = ""  # remove length constraint here
    office_location: Optional[str] = ""

    # Optional: you can add validator to fix or warn invalid emails
    @validator("email", pre=True, always=True)
    def validate_email(cls, v):
        if not v or "@" not in v:
            return None  # or return "unknown@example.com"
        return v

    @validator("phone", pre=True, always=True)
    def validate_phone(cls, v):
        if not v or len(v) < 10:
            return ""  # or return some default phone
        return v

class AdminRegistration(BaseModel):
    name: constr(min_length=1, max_length=100)
    username: constr(min_length=3, max_length=50)
    email: EmailStr
    dob: constr(min_length=4, max_length=20)
    password: constr(min_length=4)
    phone: constr(min_length=10, max_length=15) = ""
    address: str = ""



class ClassSchedule(BaseModel):
    course_id: constr(min_length=1, max_length=20)
    course_name: constr(min_length=1, max_length=100)
    course_instructor: constr(min_length=1, max_length=100)
    batch: constr(min_length=1, max_length=20)
    semester: constr(min_length=1, max_length=20)
    name_of_day: constr(min_length=1, max_length=20)
    room: constr(min_length=1, max_length=20)
    start_time: str  # e.g. "09:00:00"


class ExamSchedule(BaseModel):
    course_id: Optional[str] = None
    course_name: constr(min_length=1, max_length=100)
    exam_type: Optional[constr(max_length=50)] = None
    exam_date: Optional[str] = None  # "YYYY-MM-DD"
    start_time: Optional[str] = None # "HH:MM:SS"
    end_time: Optional[str] = None   # "HH:MM:SS"
    location: Optional[constr(max_length=100)] = None
    semester: constr(min_length=1, max_length=10)
    batch: constr(min_length=1, max_length=20)



class Announcement(BaseModel):
    title: constr(min_length=1, max_length=255)
    content: constr(min_length=1)
    created_by: str = "Admin"


class BookingRequest(BaseModel):
    user_id: int
    resource_name: str
    booking_date: date
    start_time: time
    end_time: time
    purpose: str = Field(..., min_length=3, max_length=255)
    contact: constr(min_length=3, max_length=100)
    participants: int
    status: str = "pending"


class AdmissionApplication(BaseModel):
    applicant_name: str
    email: EmailStr
    phone: str
    dob: str  # Format: YYYY-MM-DD
    program_applied: str
    academic_background: str
    statement_of_purpose: str
    status: str = "pending"


class LoginRequest(BaseModel):
    email: constr(min_length=3, max_length=100)
    password: constr(min_length=4)
    role: constr(min_length=3, max_length=20)


class Assignment(BaseModel):
    course_id: str
    course_name: str
    created_by: str
    year: str
    title: str
    description: str | None = None
    due_date: date | None = None  # 'YYYY-MM-DD'

class GetAssignment(BaseModel):
    id: int
    course_id: str
    course_name: str
    created_by: str
    year: str
    title: str
    description: str | None = None
    due_date: date | None = None  # 'YYYY-MM-DD'


class StudentAssignmentSubmission(BaseModel):
    assignment_id: int
    student_id: int
    file_url: str











############################sakib-----------------------



class BookingRequest(BaseModel):
    user_id: int
    resource_name: str
    resource_type : str
    booking_date: date
    start_time: time
    end_time: time
    purpose: str = Field(..., min_length=3, max_length=255)
    contact: constr(min_length=3, max_length=100)
    participants: int
    status: str = "pending"

class EquipmentCreate(BaseModel):
    resource_type: str
    resource_name: str
    start_time: time
    end_time: time
    description: str = ""
    image: str = ""


#####333images

from pydantic import BaseModel

# class ImageOut(BaseModel):
#     id: int
#     image: str

#     class Config:
#         orm_mode = True

class pImageOut(BaseModel):
    email:str
    image: str

    class Config:
        orm_mode = True

class eImageOut(BaseModel):
    id:int
    image: str

    class Config:
        orm_mode = True
############################projects

from pydantic import BaseModel, HttpUrl, constr
from datetime import date

class ProjectCreate(BaseModel):
    student_name: constr(min_length=1)
    supervisor_name: constr(min_length=1)
    project_title: constr(min_length=1)
    project_abstract: constr(min_length=1)
    demo_link: str
    date: date
    type_or_field: constr(min_length=1)

class ProjectOut(ProjectCreate):
    id: int

    class Config:
        orm_mode = True




#farhan 

class Degree(BaseModel):
    id: int
    name: str

class Course(BaseModel):
    id: int
    code: str
    title: str
    instructor: Optional[str]
    semester: Optional[str]
    degree_id: Optional[int]
    level: str
    description: Optional[str]



class CourseCreate(BaseModel):
    code: str
    title: str
    instructor: Optional[str]
    semester: Optional[str]
    degree_id: Optional[int]
    level: str
    description: Optional[str]






# rhitruaj 

from pydantic import BaseModel, Field, constr
from typing import List
from datetime import date, datetime
# … your existing imports …

class FeeStructureCreate(BaseModel):
    year: int = Field(..., ge=2000)
    fee_type: constr(min_length=3, max_length=50)
    deadline: date
    amount: float = Field(..., gt=0)

class FeeStructureOut(BaseModel):
    id: int
    year: int
    fee_type: str
    deadline: date
    amount: float

    class Config:
        orm_mode = True

class PaymentCreate(BaseModel):
    fee_structure_id: int
    student_id: int
    amount_paid: float = Field(..., gt=0)

class PaymentOut(BaseModel):
    id: int
    fee_structure_id: int
    student_id: int
    amount_paid: float
    payment_date: datetime

    class Config:
        orm_mode = True




from typing import Optional
from pydantic import Field


class FeeStructureUpdate(BaseModel):
    year: Optional[int] = Field(None, ge=2000, le=2100)
    fee_type: Optional[constr(min_length=3, max_length=50)]
    deadline: Optional[date]
    amount: Optional[float] = Field(None, gt=0)


# 16july

from pydantic import BaseModel, EmailStr, conint
from datetime import datetime
from typing import Optional, List

class FacultyRatingCreate(BaseModel):
    student_id: int
    faculty_email: EmailStr
    rating: conint(ge=1, le=5)
    comment: Optional[str] = ""

class RatingOut(BaseModel):
    id: int
    student_id: int
    faculty_email: EmailStr
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

class FacultyRatingStats(BaseModel):
    faculty_email: EmailStr
    average_rating: float
    total_ratings: int

class FacultyComment(BaseModel):
    student_id: int
    comment: str
    created_at: datetime

    class Config:
        orm_mode = True
#333333333333333333333333fron rokon 12 am
from datetime import date, time

class EventCreate(BaseModel):
    title: str
    description: str
    event_date: date
    start_time: time
    end_time: time
    location: Optional[str]
    created_by: int  # referencing users(id)

class EventOut(EventCreate):
    id: int

    class Config:
        orm_mode = True