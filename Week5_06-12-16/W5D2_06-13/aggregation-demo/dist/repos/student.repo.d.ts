declare class StudentRepository {
    getFilteredStudents(filter: any): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
        toJSON: {
            virtuals: true;
        };
        toObject: {
            virtuals: true;
        };
    }> & Omit<{
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getSortedStudents(filter: any, sort: any): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
        toJSON: {
            virtuals: true;
        };
        toObject: {
            virtuals: true;
        };
    }> & Omit<{
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getPaginatedStudents(filter: any, skip: number, limit: number, sort: any): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
        toJSON: {
            virtuals: true;
        };
        toObject: {
            virtuals: true;
        };
    }> & Omit<{
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    countStudents(filter: any): Promise<number>;
    getStudentsWithCourses(): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
        toJSON: {
            virtuals: true;
        };
        toObject: {
            virtuals: true;
        };
    }> & Omit<{
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getStudentWithCourses(id: string): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
        toJSON: {
            virtuals: true;
        };
        toObject: {
            virtuals: true;
        };
    }> & Omit<{
        name: string;
        age: number;
        semester: number;
        email: string;
        courses: import("mongoose").Types.ObjectId[];
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null>;
    aggregateStudents(pipeline: any[]): Promise<any[]>;
}
declare const _default: StudentRepository;
export default _default;
//# sourceMappingURL=student.repo.d.ts.map