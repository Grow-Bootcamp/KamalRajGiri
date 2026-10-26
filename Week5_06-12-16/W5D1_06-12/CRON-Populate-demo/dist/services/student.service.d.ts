export declare class StudentService {
    newStudent(data: object): Promise<import("mongoose").Document<unknown, {}, {
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
    getAllStudents(): Promise<(import("mongoose").Document<unknown, {}, {
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
    getAStudent(id: string): Promise<(import("mongoose").Document<unknown, {}, {
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
    getAllStudentsWithCourse(): Promise<(import("mongoose").Document<unknown, {}, {
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
    getAStudentWithCourse(id: string): Promise<(import("mongoose").Document<unknown, {}, {
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
//# sourceMappingURL=student.service.d.ts.map