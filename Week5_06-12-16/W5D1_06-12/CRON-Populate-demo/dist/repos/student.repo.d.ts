export declare class StudentRepository {
    addStudent(students: object): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    getStudents(Students: object): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getStudentById(Id: string): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null>;
    getStudentsWithCourse(Students: object): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getStudentWithCourseById(Id: string): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        age: number;
        email: string;
        course: import("mongoose").Types.ObjectId;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null>;
}
//# sourceMappingURL=student.repo.d.ts.map