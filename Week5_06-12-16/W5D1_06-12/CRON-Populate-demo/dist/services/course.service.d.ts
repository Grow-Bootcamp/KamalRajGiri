export declare class CourseService {
    newCourse(data: object): Promise<import("mongoose").Document<unknown, {}, {
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
    getAllCourses(): Promise<(import("mongoose").Document<unknown, {}, {
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
    getACourse(id: string): Promise<(import("mongoose").Document<unknown, {}, {
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
//# sourceMappingURL=course.service.d.ts.map