export declare class CourseRepository {
    addCourse(Courses: object): Promise<import("mongoose").Document<unknown, {}, {
        name: string;
        code: string;
        duration: number;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        code: string;
        duration: number;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    getCourses(Courses: object): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        code: string;
        duration: number;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        code: string;
        duration: number;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>)[]>;
    getCourseById(Id: string): Promise<(import("mongoose").Document<unknown, {}, {
        name: string;
        code: string;
        duration: number;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, {
        timestamps: true;
    }> & Omit<{
        name: string;
        code: string;
        duration: number;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>) | null>;
}
//# sourceMappingURL=course.repo.d.ts.map