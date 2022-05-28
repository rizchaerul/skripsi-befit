import { FunctionalComponent } from "react";
import { RteInput } from "../forms/inputs/RteInput";
import SmartForm, { SmartFormProps } from "../forms/SmartForm";

interface WorkoutForm {
    categoryId: string;
    isMinute: string;
    name: string;
    description: string;
    videoUrl: string;
    iconBase64: string | FileList;
}

export const CreateEditWorkout: FunctionalComponent<
    SmartFormProps<WorkoutForm> & {
        categoryId: string;
        isEdit?: boolean;
    }
> = (props) => {
    const { isEdit = false } = props;

    return (
        <SmartForm.Form {...props}>
            {props.children}

            <div className="my-3">
                <div className="form-floating">
                    <SmartForm.Input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="-"
                        options={{
                            required: {
                                value: true,
                                message: "Workout Name is required",
                            },
                        }}
                    />

                    <label>Workout Name</label>
                </div>

                <small className="mt-1 w-100 text-danger">
                    <SmartForm.Error name="name" />
                </small>
            </div>

            <div className="my-3">
                <div className="form-floating">
                    <SmartForm.Select
                        name="isMinute"
                        className="form-select"
                        options={{
                            required: {
                                value: true,
                                message: "Workout Repetition is required",
                            },
                        }}
                    >
                        <option value="false">Time(s)</option>
                        <option value="true">Minute(s)</option>
                    </SmartForm.Select>

                    <label>Workout Repetition Unit</label>
                </div>

                <small className="mt-1 w-100 text-danger">
                    <SmartForm.Error name="isMinute" />
                </small>
            </div>

            <div className="my-3">
                <RteInput
                    name="description"
                    options={{
                        validate: async (value) => {
                            const text = value as string;

                            if (text === "<p><br></p>") {
                                return "Description is required";
                            }

                            return true;
                        },
                    }}
                />

                <small className="mt-1 w-100 text-danger">
                    <SmartForm.Error name="description" />
                </small>
            </div>

            <div className="my-3">
                <div className="form-floating">
                    <SmartForm.Input
                        type="text"
                        name="videoUrl"
                        className="form-control"
                        placeholder="-"
                        options={{
                            required: {
                                value: true,
                                message: "Video Link is required",
                            },
                        }}
                    />

                    <label>Video Link</label>
                </div>

                <small className="mt-1 w-100 text-danger">
                    <SmartForm.Error name="videoUrl" />
                </small>
            </div>

            <label htmlFor="iconBase64" className="form-label">
                Icon
            </label>

            <SmartForm.Input
                type="file"
                accept="image/png,image/jpeg"
                name="iconBase64"
                id="iconBase64"
                className="form-control"
                options={{
                    required: {
                        value: isEdit === false,
                        message: "Icon is required",
                    },
                    validate: async (value) => {
                        if (isEdit) {
                            if (typeof value === "string") return true;
                        }

                        const files = value as FileList;

                        if (files.length > 0) {
                            const file = value[0] as File;

                            if (
                                file.type !== "image/png" &&
                                file.type !== "image/jpeg"
                            ) {
                                return "Must be a JPG or PNG file.";
                            }

                            if (file.size > 1_000_000) {
                                return "Maximum file size is 1mb.";
                            }
                        } else if (isEdit) {
                            return "Icon is required.";
                        }

                        return true;
                    },
                }}
            />

            <small className="mt-1 w-100 text-danger">
                <SmartForm.Error name="iconBase64" />
            </small>
        </SmartForm.Form>
    );
};
