declare class StudentService {
    getStudents(filter: any): Promise<(import("mongoose").Document<unknown, {}, {
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
    getPaginatedStudents(filter: any, page: number, limit: number, sort: any): Promise<{
        students: (import("mongoose").Document<unknown, {}, {
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
        }>)[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            skip: number;
        };
    }>;
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
declare const _default: StudentService;
export default _default;
//# sourceMappingURL=student.service.d.ts.map