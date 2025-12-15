# filepath: cseduBackend/main.py

from fastapi import FastAPI, HTTPException , Path , Query
from pydantic import BaseModel, EmailStr, constr
from passlib.hash import bcrypt
from datetime import datetime
import mysql.connector # Ensure you have mysql-connector-python installed
import asyncpg  # Ensure you have asyncpg installed
from datetime import timedelta, date


from fastapi.middleware.cors import CORSMiddleware
from pydantic import Field
from fpdf import FPDF

from model import UserRegistration# Assuming UserRegistration is defined in model.py
from model import StudentRegistration # Assuming StudentRegistration is defined in model.py
from model import FacultyRegistration, AdminRegistration ,BookingRequest,AdmissionApplication# Assuming FacultyRegistration is defined in model.py
from model import ClassSchedule,pImageOut,eImageOut, ExamSchedule, Announcement, LoginRequest, Assignment  # Assuming ClassSchedule is defined in model.py
from model import GetAssignment, StudentAssignmentSubmission  # Assuming GetAssignment is defined in model.py
from model import Degree, Course, CourseCreate
from model import FeeStructureCreate, FeeStructureOut, PaymentCreate, PaymentOut, FeeStructureUpdate ,FacultyOut


from typing import List, Optional 
# FastAPI application instance
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





# MySQL connection config (adjust as needed)
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "123456",
    "database": "csedu_db"
}





# class UserRegistration(BaseModel):
#     username: constr(min_length=3, max_length=50)
#     email: EmailStr
#     password: constr(min_length=4)
#     role: constr(min_length=3, max_length=20)

@app.post("/register")
def register_user(user: UserRegistration):
    # Hash the password
    password_hash = bcrypt.hash(user.password)
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        # Insert user into database
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            user.username,
            user.email,
            password_hash,
            user.role,
            datetime.now(),
            datetime.now()
        ))
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "User registered successfully!", "user_id": user_id}
    except mysql.connector.IntegrityError as e:
        raise HTTPException(status_code=400, detail="Username or email already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/home")
def home():
    return {"message": "This is the home endpoint of CSEDU Backend!"} 


# @app.get("/")
# def read_root():
#     return {"message": "Welcome to CSEDU Backend!"}

from fastapi import Form, File, UploadFile
import os, shutil


from fastapi.staticfiles import StaticFiles

STUDENT_IMAGES_DIR = "student_images"
os.makedirs(STUDENT_IMAGES_DIR, exist_ok=True)
app.mount("/student_images", StaticFiles(directory=STUDENT_IMAGES_DIR), name="student_images")

@app.post("/register-student")
def register_student(
    name: str = Form(...),
    email: str = Form(...),
    dob: str = Form(...),
    current_year: str = Form(...),
    program: str = Form(...),
    bio: str = Form(""),
    profile_image: UploadFile = File(None)
):
    try:
        file_path = ""
        if profile_image:
            file_path = os.path.join(STUDENT_IMAGES_DIR, profile_image.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(profile_image.file, buffer)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO students (name, email, dob, current_year, program, profile_image, bio)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            name,
            email,
            dob,
            current_year,
            program,
            file_path,
            bio
        ))
        conn.commit()
        student_db_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return {"message": "Student registered successfully!", "student_id": student_db_id}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=400, detail="Student with this email or student_id already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#get student id by email
@app.get("/get_student_id/{email}", response_model=int)
def get_student_id(email: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT student_id FROM students WHERE email = %s", (email,))
        student = cursor.fetchone()
        cursor.close()
        conn.close()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found.")
        return student["student_id"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Backend changes for faculty image upload support

from fastapi import Form, File, UploadFile
import os, shutil
from fastapi.staticfiles import StaticFiles

# 1. Directory for storing faculty images
FACULTY_IMAGE_DIR = "faculty_images"
os.makedirs(FACULTY_IMAGE_DIR, exist_ok=True)

# 2. Mount the faculty_images directory for static access
app.mount("/faculty_images", StaticFiles(directory=FACULTY_IMAGE_DIR), name="faculty_images")

# 3. Modify POST API to accept image as multipart/form-data
@app.post("/register-faculty")
def register_faculty(
    name: str = Form(...),
    email: str = Form(...),
    title: str = Form(...),
    department: str = Form(...),
    bio: str = Form(""),
    phone: str = Form(""),
    office_location: str = Form(""),
    profile_image: UploadFile = File(None)
):
    try:
        file_path = ""
        if profile_image:
            file_path = os.path.join(FACULTY_IMAGE_DIR, profile_image.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(profile_image.file, buffer)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO faculty (name, email, title, department, profile_image, bio, phone, office_location)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            name,
            email,
            title,
            department,
            file_path,
            bio,
            phone,
            office_location
        ))
        conn.commit()
        faculty_db_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return {"message": "Faculty registered successfully!", "faculty_id": faculty_db_id}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=400, detail="Faculty with this ID already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/faculty/{email}", response_model=FacultyRegistration)
def get_faculty_by_email(email: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM faculty WHERE email = %s", (email,))
        faculty = cursor.fetchone()
        cursor.close()
        conn.close()
        if not faculty:
            raise HTTPException(status_code=404, detail="Faculty not found.")

        return FacultyRegistration(
            name=faculty["name"],
            email=faculty["email"],
            title=faculty["title"],
            department=faculty["department"],
            profile_image=faculty.get("profile_image", ""),
            bio=faculty.get("bio", ""),
            phone=faculty.get("phone", ""),
            office_location=faculty.get("office_location", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#i want create an get api to get name of a faculty by email . 

@app.get("/get-faculty-name/{email}", response_model=str)
def get_faculty_name(email: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM faculty WHERE email = %s", (email,))
        faculty = cursor.fetchone()
        cursor.close()
        conn.close()
        if not faculty:
            raise HTTPException(status_code=404, detail="Faculty not found.")
        return faculty[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/get-all-faculty", response_model=List[FacultyOut])
def get_all_faculty():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT name, email, title, department, profile_image, bio, phone, office_location FROM faculty")
        faculties = cursor.fetchall()
        cursor.close()
        conn.close()
        return faculties
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/register-admin")
def register_admin(admin: AdminRegistration):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO admin (name, username, email, dob, password_hash, phone, address)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            admin.name,
            admin.username,
            admin.email,
            admin.dob,
            bcrypt.hash(admin.password),
            admin.phone,
            admin.address
        ))
        conn.commit()
        admin_db_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Admin registered successfully!", "admin_id": admin_db_id}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=400, detail="Admin with this ID or email already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
    







@app.post("/book-room")
def book_room(booking: BookingRequest):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO bookings (user_id, resource_type, resource_name, booking_date, start_time, end_time, purpose, participants, contact_info, status)
            VALUES (%s, 'room', %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            booking.user_id,
            booking.resource_name,
            booking.booking_date,
            booking.start_time,
            booking.end_time,
            booking.purpose,
            booking.participants,
            booking.contact,
            booking.status
        ))
        conn.commit()
        booking_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Booking request submitted successfully!", "booking_id": booking_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.get("/user-bookings/{user_id}")
# def user_bookings(user_id: int):
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("""
#             SELECT * FROM bookings WHERE user_id = %s
#         """, (user_id,))
#         bookings = cursor.fetchall()
#         cursor.close()
#         conn.close()
#         return {"bookings": bookings}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    



@app.put("/approve-booking/{booking_id}")
def approve_booking(booking_id: int, status: str):
    if status not in ["approved", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE bookings SET status = %s WHERE id = %s
        """, (status, booking_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": f"Booking {status} successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



@app.put("/cancel-booking/{booking_id}")
def cancel_booking(booking_id: int, user_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Check if the booking exists and belongs to the user
        cursor.execute("SELECT status FROM bookings WHERE id = %s AND user_id = %s", (booking_id, user_id))
        booking = cursor.fetchone()

        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found or does not belong to the user.")

        # Allow cancellation if booking is 'pending' or 'approved'
        if booking['status'] not in ['pending', 'approved']:
            raise HTTPException(status_code=400, detail="Booking cannot be canceled.")

        # Update status to 'canceled'
        cursor.execute("UPDATE bookings SET status = 'canceled' WHERE id = %s", (booking_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Booking canceled successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





@app.get("/user-bookings/{user_id}")
def get_user_bookings(user_id: int, status: str = None):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Construct SQL query with optional status filter
        if status:
            query = "SELECT * FROM bookings WHERE user_id = %s AND status = %s"
            params = (user_id, status)
        else:
            query = "SELECT * FROM bookings WHERE user_id = %s"
            params = (user_id,)

        cursor.execute(query, params)
        bookings = cursor.fetchall()
        cursor.close()
        conn.close()

        if not bookings:
            return {"message": "No bookings found."}

        return {"bookings": bookings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/admin-bookings")
def get_admin_bookings(status: str = None):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Construct SQL query based on status filter
        if status in ['pending', 'approved', 'canceled']:
            query = "SELECT * FROM bookings WHERE status = %s"
            params = (status,)
        else:
            query = "SELECT * FROM bookings"
            params = ()

        cursor.execute(query, params)
        bookings = cursor.fetchall()
        cursor.close()
        conn.close()

        if not bookings:
            return {"message": "No bookings found."}

        return {"bookings": bookings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/student/{email}", response_model=StudentRegistration)
def get_student_by_student_id(email: str = Path(..., description="The student_id to search for")):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM students WHERE email = %s", (email,))
        student = cursor.fetchone()
        cursor.close()
        conn.close()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found.")
        # Map DB fields to StudentRegistration model
        return StudentRegistration(
            name=student["name"],
            email=student["email"],
            dob=str(student["dob"]),
            current_year=str(student["current_year"]),
            program=student["program"],
            profile_image=student.get("profile_image", ""),
            bio=student.get("bio", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/admin/{email}", response_model=AdminRegistration)
def get_admin_by_email(
    email: str = Path(..., description="The admin email to search for")
):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM admin WHERE email = %s", (email,))
        admin = cursor.fetchone()
        cursor.close()
        conn.close()

        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found.")

        return AdminRegistration(
            name=admin["name"],
            username=admin["username"],
            email=admin["email"],
            dob=str(admin["dob"]),
            password=admin["password_hash"],
            phone=admin.get("phone") or "",
            address=admin.get("address") or ""
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/admission/apply")
async def apply_admission(application: AdmissionApplication):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO admission_applications
            (applicant_name, email, phone, dob, program_applied, academic_background, statement_of_purpose, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            application.applicant_name,
            application.email,
            application.phone,
            application.dob,
            application.program_applied,
            application.academic_background,
            application.statement_of_purpose,
            application.status
        ))

        conn.commit()

        last_id = cursor.lastrowid

        # Fetch the inserted row if needed
        cursor.execute("SELECT * FROM admission_applications WHERE id = %s", (last_id,))
        row = cursor.fetchone()
        columns = [desc[0] for desc in cursor.description]
        result = dict(zip(columns, row))

        cursor.close()
        conn.close()

        return {"success": True, "application": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.get("/faculty/{email}", response_model=FacultyRegistration)
# def get_faculty_by_email(email: str):
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM faculty WHERE email = %s", (email,))
#         faculty = cursor.fetchone()
#         cursor.close()
#         conn.close()
#         if not faculty:
#             raise HTTPException(status_code=404, detail="Faculty not found.")
#         return FacultyRegistration(
#             name=faculty["name"],
#             email=faculty["email"],
#             title=faculty["title"],
#             department=faculty["department"],
#             profile_image=faculty.get("profile_image", ""),
#             bio=faculty.get("bio", ""),
#             phone=faculty.get("phone", ""),
#             office_location=faculty.get("office_location", "")
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))




@app.post("/create-class-schedule")
def create_class_schedule(schedule: ClassSchedule):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO class_schedules 
            (course_id, course_name, course_instructor, batch, semester, name_of_day, room, start_time)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            schedule.course_id,
            schedule.course_name,
            schedule.course_instructor,
            schedule.batch,
            schedule.semester,
            schedule.name_of_day,
            schedule.room,
            schedule.start_time
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Class schedule created successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/create-exam-schedule")
def create_exam_schedule(schedule: ExamSchedule):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO exam_routines 
            (course_id, course_name, exam_type, exam_date, start_time, end_time, location, semester, batch)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            schedule.course_id,
            schedule.course_name,
            schedule.exam_type,
            schedule.exam_date,
            schedule.start_time,
            schedule.end_time,
            schedule.location,
            schedule.semester,
            schedule.batch
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Exam schedule created successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/create-announcements")
def create_announcement(announcement: Announcement):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO announcements (title, content, created_by)
            VALUES (%s, %s, %s)
        """, (
            announcement.title,
            announcement.content,
            announcement.created_by
        ))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Announcement created successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/login")
def simple_login_check(login: LoginRequest):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM users WHERE email=%s AND role=%s", 
                       (login.email, login.role))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if user and bcrypt.verify(login.password, user['password_hash']):
            return {"message": "Yes, user found."}
        else:
            return {"message": "No user found."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/add-assignment")
def add_assignment(assignment: Assignment):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = """
            INSERT INTO assignments 
            (course_id, course_name, created_by, year, title, description, due_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            assignment.course_id,
            assignment.course_name,
            assignment.created_by,
            assignment.year,
            assignment.title,
            assignment.description,
            assignment.due_date
        )

        cursor.execute(sql, values)
        conn.commit()

        cursor.close()
        conn.close()

        return {"message": "Assignment added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#get assignments by year
@app.get("/get-assignments/{year}", response_model=List[GetAssignment])    
def get_assignments_by_year(year: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id , course_id, course_name, created_by, year, title, description, due_date
            FROM assignments WHERE year = %s
        """, (year,))
        assignments = cursor.fetchall()

        cursor.close()
        conn.close()

        if not assignments:
            raise HTTPException(status_code=404, detail="No assignments found for this year.")

        return assignments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/submit-assignment-link")
def submit_assignment_link(submission: StudentAssignmentSubmission):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO assignment_submissions (assignment_id, student_id, file_url, submitted_at)
            VALUES (%s, %s, %s, NOW())
        """, (submission.assignment_id, submission.student_id, submission.file_url))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Submission recorded"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# check if a student has submitted an assignment or not . ther is two query parameter assignment_id and student_id
@app.get("/check-submission")
def check_submission(assignment_id: int, student_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM assignment_submissions
            WHERE assignment_id = %s AND student_id = %s
        """, (assignment_id, student_id))
        submission = cursor.fetchall()
        cursor.close()
        conn.close()
        if submission:
            return {"message": "Submission found", "data": submission}
        else:
            return {"message": "No submission found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# I want to check assignment submission by assignment_id only . 
@app.get("/check-submission-by-assignment_id")
def check_submission_by_assignment_id(assignment_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM assignment_submissions
            WHERE assignment_id = %s
        """, (assignment_id,))
        submissions = cursor.fetchall()
        cursor.close()
        conn.close()
        if submissions:
            return {"message": "Submissions found", "data": submissions}
        else:
            return {"message": "No submissions found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@app.put("/update_grade_feedback_for_submited_assignment")
def update_submission(assignment_id: int, student_id: int, grade: str, feedback: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE assignment_submissions
            SET grade=%s, feedback=%s
            WHERE assignment_id=%s AND student_id=%s
        """, (grade, feedback, assignment_id, student_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Submission updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#i want to create an get api to get all the assignments of a faclty . query parameter is faculty name
@app.get("/get-assignments-by-faculty")
def get_assignments_by_faculty(faculty_name: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM assignments
            WHERE created_by = %s
        """, (faculty_name,))
        assignments = cursor.fetchall()
        cursor.close()
        conn.close()
        if not assignments:
            raise HTTPException(status_code=404, detail="No assignments found for this faculty.")
        return assignments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# GET API: class_schedules
# =========================
@app.get("/get_class_schedules", response_model=List[ClassSchedule])
def get_class_schedules():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT course_id, course_name, course_instructor, batch, semester,
                   name_of_day, room, start_time
            FROM class_schedules
        """)
        rows = cursor.fetchall()
        # Convert timedelta to string
        for row in rows:
            if isinstance(row["start_time"], (str, type(None))):
                continue
            # else it's timedelta
            seconds = row["start_time"].total_seconds()
            hours = int(seconds // 3600)
            minutes = int((seconds % 3600) // 60)
            seconds = int(seconds % 60)
            row["start_time"] = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GET API: exam_routines
# =========================


def normalize_exam_routine_row(row):
    # convert date
    if isinstance(row.get("exam_date"), date):
        row["exam_date"] = row["exam_date"].isoformat()
    # convert times
    for t in ["start_time", "end_time"]:
        if isinstance(row.get(t), timedelta):
            seconds = int(row[t].total_seconds())
            hours = seconds // 3600
            minutes = (seconds % 3600) // 60
            secs = seconds % 60
            row[t] = f"{hours:02d}:{minutes:02d}:{secs:02d}"
    # convert year to string
    if isinstance(row.get("year"), int):
        row["year"] = str(row["year"])
    return row



@app.get("/get_exam_routines", response_model=List[ExamSchedule])
def get_exam_routines():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT course_id, course_name, exam_type, exam_date,
                   start_time, end_time, location, semester , batch
            FROM exam_routines
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # normalize all rows
        for row in rows:
            normalize_exam_routine_row(row)

        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# =========================
# GET API: announcements
# =========================
@app.get("/get_announcements", response_model=List[Announcement])
def get_announcements():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT title, content,
                   COALESCE(CAST(created_by AS CHAR), 'Admin') AS created_by
            FROM announcements
            ORDER BY created_at DESC
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    













######################### sakib ######################







@app.post("/book-room")
def book_room(booking: BookingRequest):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO bookings (user_id, resource_type, resource_name, booking_date, start_time, end_time, purpose, participants, contact_info, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            booking.user_id,
            booking.resource_name,
            booking.resource_type,
            booking.booking_date,
            booking.start_time,
            booking.end_time,
            booking.purpose,
            booking.participants,
            booking.contact,
            booking.status
        ))
        conn.commit()
        booking_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Booking request submitted successfully!", "booking_id": booking_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.get("/user-bookings/{user_id}")
# def user_bookings(user_id: int):
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("""
#             SELECT * FROM bookings WHERE user_id = %s
#         """, (user_id,))
#         bookings = cursor.fetchall()
#         cursor.close()
#         conn.close()
#         return {"bookings": bookings}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    



@app.put("/approve-booking/{booking_id}")
def approve_booking(booking_id: int, status: str):
    if status not in ["approved", "declined"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE bookings SET status = %s WHERE id = %s
        """, (status, booking_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": f"Booking {status} successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



@app.put("/cancel-booking/{booking_id}")
def cancel_booking(booking_id: int, user_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Check if the booking exists and belongs to the user
        cursor.execute("SELECT status FROM bookings WHERE id = %s AND user_id = %s", (booking_id, user_id))
        booking = cursor.fetchone()

        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found or does not belong to the user.")

        # Allow cancellation if booking is 'pending' or 'approved'
        if booking['status'] not in ['pending', 'approved']:
            raise HTTPException(status_code=400, detail="Booking cannot be canceled.")

        # Update status to 'canceled'
        cursor.execute("UPDATE bookings SET status = 'canceled' WHERE id = %s", (booking_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Booking canceled successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





@app.get("/user-bookings/{user_id}")
def get_user_bookings(user_id: int, status: str = None):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Construct SQL query with optional status filter
        if status:
            query = "SELECT * FROM bookings WHERE user_id = %s AND status = %s"
            params = (user_id, status)
        else:
            query = "SELECT * FROM bookings WHERE user_id = %s"
            params = (user_id,)

        cursor.execute(query, params)
        bookings = cursor.fetchall()
        cursor.close()
        conn.close()

        if not bookings:
            return {"message": "No bookings found."}

        return {"bookings": bookings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/admin-bookings")
def get_admin_bookings(status: str = None):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Construct SQL query based on status filter
        if status in ['pending', 'approved', 'canceled']:
            query = "SELECT * FROM bookings WHERE status = %s"
            params = (status,)
        else:
            query = "SELECT * FROM bookings"
            params = ()

        cursor.execute(query, params)
        bookings = cursor.fetchall()
        cursor.close()
        conn.close()

        if not bookings:
            return {"message": "No bookings found."}

        return {"bookings": bookings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


        ##########equi[mmeetet]









from fastapi import Form, File, UploadFile
import os, shutil
from fastapi.staticfiles import StaticFiles





# --- 1. Directory for storing equipment images ---
EQUIPMENT_IMAGE_DIR = "equipment_images"
os.makedirs(EQUIPMENT_IMAGE_DIR, exist_ok=True)

# --- 2. Mount for static access ---
app.mount("/equipment_images", StaticFiles(directory=EQUIPMENT_IMAGE_DIR), name="equipment_images")

# --- 3. CORS Middleware ---

# --- 4. POST API: Register equipment ---
@app.post("/create-equipment")
def create_equipment(
    resource_type: str = Form(...),
    resource_name: str = Form(...),
    start_time: str = Form(...),  # sent as "HH:MM:SS"
    end_time: str = Form(...),
    description: str = Form(""),
    image: UploadFile = File(None)
):
    try:
        image_path = ""
        if image:
            filename = image.filename.replace(" ", "_")
            image_path = os.path.join(EQUIPMENT_IMAGE_DIR, filename)
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO equipment (resource_type, resource_name, start_time, end_time, description, image)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            resource_type,
            resource_name,
            start_time,
            end_time,
            description,
            image_path
        ))
        conn.commit()
        equipment_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return {"message": "✅ Equipment created!", "equipment_id": equipment_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 5. GET API: Retrieve all equipment with image URLs ---
@app.get("/equipment")
def get_all_equipment():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, resource_type, resource_name, start_time, end_time, description, image FROM equipment")
        equipment_list = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return {"equipment": equipment_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @app.get("/next-equipment-id")
# def get_next_equipment_id():
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor()
#         cursor.execute("SELECT COUNT(*) FROM equipment")
#         count = cursor.fetchone()[0]
#         cursor.close()
#         conn.close()

#         next_id = count + 1
#         return {"next_id": next_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
  
    
# ////////////////////////////////////////////////////////////////////////////////////////// p images

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from model import pImageOut
import shutil
import os


# Upload directory
UPLOAD_DIR = "uploadsfgfgf"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# POST: Upload image
@app.post("/upload-image")
def upload_image(email: str = Form(...), file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO pimages (email, image) VALUES (%s, %s)", (email, file_path))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Image uploaded successfully!", "image_path": file_path}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="Email already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET: Get image path by email
@app.get("/image-by-email/{email}", response_model=pImageOut)
def get_image_by_email(email: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT email, image FROM pimages WHERE email = %s", (email,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail="Image not found for this email")

        return {"email": row[0], "image": row[1]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET: Serve actual image file
@app.get("/image-file/{filename}")
def get_image_file(filename: str):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(filepath)









############### equipment image

from fastapi import Form  # Already used

# Upload directory for eimages
EUPLOAD_DIR = "uploads_eimages"
os.makedirs(EUPLOAD_DIR, exist_ok=True)

# POST: Upload eimage by ID
@app.post("/upload-eimage")
def upload_eimage(id: int = Form(...), file: UploadFile = File(...)):
    file_path = os.path.join(EUPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO eimages (id, image) VALUES (%s, %s)", (id, file_path))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "EImage uploaded successfully!", "image_path": file_path}
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=409, detail="ID already exists.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET: Get eimage by ID
@app.get("/eimage-by-id/{id}", response_model=eImageOut)
def get_eimage_by_id(id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT id, image FROM eimages WHERE id = %s", (id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            raise HTTPException(status_code=404, detail="EImage not found for this ID")

        return {"id": row[0], "image": row[1]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET: Serve eimage file
@app.get("/eimage-file/{filename}")
def get_eimage_file(filename: str):
    filepath = os.path.join(EUPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="EImage file not found")
    return FileResponse(filepath)
######################################################projects
from model import ProjectCreate, ProjectOut

# POST: Create a new project
@app.post("/projects", response_model=ProjectOut)
def create_project(project: ProjectCreate):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO projects (student_name, supervisor_name, project_title, project_abstract, demo_link, date, type_or_field)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            project.student_name,
            project.supervisor_name,
            project.project_title,
            project.project_abstract,
            project.demo_link,
            project.date,
            project.type_or_field
        ))
        conn.commit()
        project_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return {**project.dict(), "id": project_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from model import ProjectCreate
from fastapi import HTTPException

@app.get("/projects", response_model=list[ProjectCreate])
def get_all_projects():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT student_name, supervisor_name, project_title, project_abstract,
                   demo_link, date, type_or_field
            FROM projects
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        # Convert rows to list of dicts
        projects = [
            {
                "student_name": row[0],
                "supervisor_name": row[1],
                "project_title": row[2],
                "project_abstract": row[3],
                "demo_link": row[4],
                "date": row[5],
                "type_or_field": row[6],
            }
            for row in rows
        ]

        return projects

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






##########farhan#######


# GET all degrees
@app.get("/api/degrees", response_model=List[Degree])
def get_degrees():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name FROM degree")
        degrees = cursor.fetchall()
        cursor.close()
        conn.close()
        return degrees
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




# GET all courses with filters
@app.get("/api/courses", response_model=List[Course])
def get_courses(
    search: str = Query("", alias="search"),
    semester: str = Query("all", alias="semester"),
    level: str = Query("all", alias="level"),
    degree_id: Optional[int] = Query(None, alias="degree_id")
):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM course WHERE 1=1"
        params = []

        if search:
            query += " AND (LOWER(title) LIKE %s OR LOWER(code) LIKE %s OR LOWER(instructor) LIKE %s)"
            s = f"%{search.lower()}%"
            params += [s, s, s]
        if semester != "all":
            query += " AND semester = %s"
            params.append(semester)
        if level != "all":
            query += " AND level = %s"
            params.append(level)
        if degree_id:
            query += " AND degree_id = %s"
            params.append(degree_id)

        cursor.execute(query, tuple(params))
        courses = cursor.fetchall()
        cursor.close()
        conn.close()
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# POST create a new course (optional, for admin)
@app.post("/api/courses", response_model=Course)
def create_course(course: CourseCreate):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO course (code, title, instructor, semester, degree_id, level, description)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            course.code,
            course.title,
            course.instructor,
            course.semester,
            course.degree_id,
            course.level,
            course.description
        ))
        conn.commit()
        course_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {**course.dict(), "id": course_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))






















# rhituraj2






from pydantic import BaseModel, Field, constr
from typing import List
from datetime import date, datetime
# … your existing imports …

# --- FEE‐STRUCTURES (admin) ---
from model import FeeStructureCreate,FeeStructureOut, PaymentCreate, PaymentOut,FeeStructureUpdate




@app.post("/fee-structures", response_model=FeeStructureOut, status_code=201)
def create_fee_structure(fs: FeeStructureCreate):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO fee_structures (year, fee_type, deadline, amount)
            VALUES (%s,%s,%s,%s)
        """, (fs.year, fs.fee_type, fs.deadline, fs.amount))
        conn.commit()
        new_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return FeeStructureOut(
            id=new_id, year=fs.year,
            fee_type=fs.fee_type,
            deadline=fs.deadline,
            amount=fs.amount
        )
    except Exception as e:
        raise HTTPException(500, detail=str(e))


# @app.get("/fee-structures", response_model=List[FeeStructureOut])
# def list_fee_structures():
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM fee_structures ORDER BY year, fee_type")
#         rows = cursor.fetchall()
#         cursor.close()
#         conn.close()
#         return rows
#     except Exception as e:
#         raise HTTPException(500, detail=str(e))



from fastapi import Query
@app.get("/fee-structures", response_model=List[FeeStructureOut])
def list_fee_structures(
    fee_type: str = Query(None),
    year: int = Query(None)
):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Build dynamic WHERE clause
        conditions = []
        params = []
        if fee_type:
            conditions.append("fee_type = %s")
            params.append(fee_type)
        if year:
            conditions.append("year = %s")
            params.append(year)

        sql = "SELECT * FROM fee_structures"
        if conditions:
            sql += " WHERE " + " AND ".join(conditions)
        sql += " ORDER BY year DESC, fee_type"

        cursor.execute(sql, params)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        raise HTTPException(500, detail=str(e))




# --- PAYMENTS (students) ---

# @app.post("/payments", response_model=PaymentOut, status_code=201)
# def pay_fee(p: PaymentCreate):
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor()
#         cursor.execute("""
#             INSERT INTO payments (fee_structure_id, student_id, amount_paid)
#             VALUES (%s,%s,%s)
#         """, (p.fee_structure_id, p.student_id, p.amount_paid))
#         conn.commit()
#         pay_id = cursor.lastrowid

#         cursor.execute("SELECT * FROM payments WHERE id = %s", (pay_id,))
#         row = cursor.fetchone()
#         cursor.close()
#         conn.close()

#         # row = (id, fee_structure_id, student_id, amount_paid, payment_date)
#         return PaymentOut(
#             id=row[0],
#             fee_structure_id=row[1],
#             student_id=row[2],
#             amount_paid=float(row[3]),
#             payment_date=row[4]
#         )
#     except mysql.connector.IntegrityError:
#         raise HTTPException(400, detail="Invalid fee_structure_id or student_id.")
#     except Exception as e:
#         raise HTTPException(500, detail=str(e))


# @app.get("/students/{student_id}/payments", response_model=List[PaymentOut])
# def list_student_payments(student_id: int):
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("""
#             SELECT * FROM payments
#             WHERE student_id = %s
#             ORDER BY payment_date DESC
#         """, (student_id,))
#         rows = cursor.fetchall()
#         cursor.close()
#         conn.close()
#         return rows
#     except Exception as e:
#         raise HTTPException(500, detail=str(e))





@app.post("/payments", response_model=PaymentOut, status_code=201)
def pay_fee(p: PaymentCreate):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO payments (fee_structure_id, student_id, amount_paid)
            VALUES (%s, %s, %s)
        """, (p.fee_structure_id, p.student_id, p.amount_paid))
        conn.commit()
        pay_id = cursor.lastrowid

        # Use dictionary cursor here to maintain consistency
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM payments WHERE id = %s", (pay_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        return row  # row is already a dictionary and matches PaymentOut
    except mysql.connector.IntegrityError:
        raise HTTPException(400, detail="Invalid fee_structure_id or student_id.")
    except Exception as e:
        raise HTTPException(500, detail=str(e))






# @app.get("/students/{student_id}", response_model=StudentRegistration)
# def get_student(student_id: int):
#     try:
#         conn = mysql.connector.connect(**db_config)
#         cursor = conn.cursor(dictionary=True)
#         cursor.execute("SELECT * FROM students WHERE student_id = %s", (student_id,))
#         student = cursor.fetchone()
#         cursor.close()
#         conn.close()
#         if not student:
#             raise HTTPException(404, detail="Student not found.")
#         return student
#     except Exception as e:
#         raise HTTPException(500, detail=str(e))








@app.get("/students/{student_id}/payments", response_model=List[PaymentOut])
def list_student_payments(student_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM payments
            WHERE student_id = %s
            ORDER BY payment_date DESC
        """, (student_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        raise HTTPException(500, detail=str(e))
    

@app.put("/fee-structures/{fee_id}", response_model=FeeStructureOut)
def update_fee_structure(fee_id: int, upd: FeeStructureUpdate):
    """
    Admin updates one or more fields on an existing fee-structure.
    """
    # Build dynamic SQL
    fields = []
    params = []
    if upd.year is not None:
        fields.append("year = %s");       params.append(upd.year)
    if upd.fee_type is not None:
        fields.append("fee_type = %s");   params.append(upd.fee_type)
    if upd.deadline is not None:
        fields.append("deadline = %s");   params.append(upd.deadline)
    if upd.amount is not None:
        fields.append("amount = %s");     params.append(upd.amount)

    if not fields:
        raise HTTPException(status_code=400, detail="Nothing to update.")

    params.append(fee_id)
    sql = f"UPDATE fee_structures SET {', '.join(fields)} WHERE id = %s"

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, params)
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Fee-structure not found.")
        conn.commit()

        # return the updated row
        cursor.execute("SELECT * FROM fee_structures WHERE id = %s", (fee_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        return row
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/fee-structures/{fee_id}", status_code=204)
def delete_fee_structure(fee_id: int):
    """
    Admin deletes a fee-structure. Returns 204 No Content on success.
    """
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM fee_structures WHERE id = %s", (fee_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Fee-structure not found.")
        conn.commit()
        cursor.close()
        conn.close()
        return  # 204 No Content
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    











from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from fpdf import FPDF
import io
import mysql.connector

@app.get("/receipt/{payment_id}")
def generate_receipt(payment_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # 1) get payment
        cursor.execute("SELECT * FROM payments WHERE id = %s", (payment_id,))
        payment = cursor.fetchone()
        if not payment:
            raise HTTPException(404, "Payment not found.")

        # 2) get fee structure
        cursor.execute(
            "SELECT * FROM fee_structures WHERE id = %s",
            (payment["fee_structure_id"],)
        )
        fee = cursor.fetchone()
        if not fee:
            raise HTTPException(404, "Fee structure not found.")

        # 3) get student
        #    <-- HERE WE NO LONGER USE `WHERE id = %s` but `WHERE student_id = %s` -->
        cursor.execute(
            "SELECT * FROM students WHERE student_id = %s",
            (payment["student_id"],)
        )
        student = cursor.fetchone()
        if not student:
            raise HTTPException(404, "Student not found.")

        cursor.close()
        conn.close()

        # Generate PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        pdf.cell(200, 10, txt="CSEDU Payment Receipt", ln=True, align="C")
        pdf.ln(10)

        pdf.set_font("Arial", size=11)
        pdf.cell(200, 10, txt=f"Receipt ID: {payment['id']}", ln=True)

        pdf.ln(5)
        pdf.cell(200, 10, txt="Student Information:", ln=True)
        # adjust these fields to whatever your students table actually has
        # here I’m assuming your students table has columns: name, email, dob, program, current_year
        pdf.cell(200, 10, txt=f"Name: {student['name']}", ln=True)
        pdf.cell(200, 10, txt=f"Email: {student['email']}", ln=True)
        pdf.cell(200, 10, txt=f"DOB: {student['dob']}", ln=True)
        pdf.cell(200, 10, txt=f"Program: {student['program']}", ln=True)
        pdf.cell(200, 10, txt=f"Current Year: {student['current_year']}", ln=True)

        pdf.ln(5)
        pdf.cell(200, 10, txt="Fee Details:", ln=True)
        pdf.cell(200, 10, txt=f"Fee Type: {fee['fee_type']}", ln=True)
        pdf.cell(200, 10, txt=f"Year: {fee['year']}", ln=True)
        pdf.cell(200, 10, txt=f"Deadline: {fee['deadline']}", ln=True)
        pdf.cell(200, 10, txt=f"Amount: BDT {fee['amount']}", ln=True)

        pdf.ln(5)
        pdf.cell(200, 10, txt="Payment Summary:", ln=True)
        pdf.cell(200, 10, txt=f"Amount Paid: BDT {payment['amount_paid']}", ln=True)
        pdf.cell(200, 10, txt=f"Payment Date: {payment['payment_date']}", ln=True)

        # Stream back as PDF file
        # pdf_bytes = io.BytesIO()
        # pdf.output(pdf_bytes)
        # pdf_bytes.seek(0)
        

        pdf_str = pdf.output(dest='S').encode('latin1')  # output PDF as string, then encode to bytes
        pdf_bytes = io.BytesIO(pdf_str)

        return StreamingResponse(
            pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=receipt_{payment_id}.pdf"
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, detail=str(e))
    

#################################################
# 16july

from fastapi import Body, Path
from typing import List
from model import (
    FacultyRatingCreate, RatingOut,
    FacultyRatingStats, FacultyComment
)



# 1) Student rates a faculty
@app.post(
    "/faculty/rate",
    response_model=RatingOut,
    summary="Student rates a faculty member"
)
def rate_faculty(r: FacultyRatingCreate = Body(...)):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            INSERT INTO faculty_ratings
              (student_id, faculty_email, rating, comment)
            VALUES (%s, %s, %s, %s)
        """, (
            r.student_id,
            r.faculty_email,
            r.rating,
            r.comment
        ))
        conn.commit()
        last_id = cursor.lastrowid

        cursor.execute("SELECT * FROM faculty_ratings WHERE id = %s", (last_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        return row

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


# 2) Faculty sees their overall rating
@app.get(
    "/faculty/{email}/rating",
    response_model=FacultyRatingStats,
    summary="Get average rating & total ratings for a faculty"
)
def get_faculty_rating_stats(
    email: str = Path(..., description="Faculty email")
):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
              AVG(rating) AS avg_rating,
              COUNT(*) AS total
            FROM faculty_ratings
            WHERE faculty_email = %s
        """, (email,))
        avg_rating, total = cursor.fetchone()
        cursor.close()
        conn.close()

        if total == 0:
            # no ratings yet
            return FacultyRatingStats(
                faculty_email=email,
                average_rating=0.0,
                total_ratings=0
            )

        return FacultyRatingStats(
            faculty_email=email,
            average_rating=round(float(avg_rating), 2),
            total_ratings=int(total)
        )

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


# 3) Faculty sees all student comments
@app.get(
    "/faculty/{email}/comments",
    response_model=List[FacultyComment],
    summary="Get all comments left by students for a faculty"
)
def get_faculty_comments(
    email: str = Path(..., description="Faculty email")
):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT student_id, comment, created_at
            FROM faculty_ratings
            WHERE faculty_email = %s
            ORDER BY created_at DESC
        """, (email,))
        comments = cursor.fetchall()
        cursor.close()
        conn.close()
        return comments

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    


from typing import List
from model import FacultyOut

@app.get(
    "/faculties",
    response_model=List[FacultyOut],
    summary="List all faculty members available for rating"
)
def list_all_faculty_for_rating():
    """
    Returns basic info (name, email, title, department, etc.) for all faculty.
    Students can choose from this list when rating.
    """
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                name,
                email,
                title,
                department,
                profile_image,
                bio,
                phone,
                office_location
            FROM faculty
            ORDER BY name
        """)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=str(e))
    


######333333333333333333 event
from model import EventCreate, EventOut

@app.post("/create-event", response_model=EventOut)
def create_event(event: EventCreate):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO events (title, description, event_date, start_time, end_time, location, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            event.title,
            event.description,
            event.event_date,
            event.start_time,
            event.end_time,
            event.location,
            event.created_by
        ))
        conn.commit()
        event_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return {**event.dict(), "id": event_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/api/announcements")
def get_announcements():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, content, created_by, created_at
            FROM announcements
            ORDER BY created_at DESC
        """)
        announcements = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"announcements": announcements}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/events")
def get_events():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, description, event_date, start_time, end_time, location, created_by, created_at
            FROM events
            ORDER BY event_date ASC, start_time ASC
        """)
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))