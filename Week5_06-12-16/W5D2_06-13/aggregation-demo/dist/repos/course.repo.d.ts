declare class CourseRepository {
    getAllCourses(): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        code: string;
        department: string;
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
        code: string;
        department: string;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getCoursesWithStudents(): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        code: string;
        department: string;
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
        code: string;
        department: string;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getCourseById(id: string): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        code: string;
        department: string;
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
        code: string;
        department: string;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null>;
}
declare const _default: CourseRepository;
export default _default;
//# sourceMappingURL=course.repo.d.ts.map