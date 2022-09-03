import { Fragment, FunctionComponent } from "react";
import ReactDatePicker from "react-datepicker";
import { useController, useFormContext } from "react-hook-form";
import { BsPlus, BsTrash } from "react-icons/bs";

export const CustomTimePicker: FunctionComponent<{
    name: string;
}> = (props) => {
    const methods = useFormContext();

    const a = useController({
        name: props.name,
        control: methods.control,
    });

    console.log(a.field.value);

    return (
        <Fragment>
            {a.field.value.map((x: string, i: number) => (
                <div className="row" key={i}>
                    <div className="col">
                        <ReactDatePicker
                            // onChange={() => 0}
                            onChange={(e) => {
                                const b = JSON.parse(
                                    JSON.stringify(a.field.value)
                                ) as string[];

                                let hours = e?.getUTCHours().toString() ?? "0";
                                let minutes =
                                    e?.getUTCMinutes().toString() ?? "0";

                                if (parseInt(hours) < 10) {
                                    hours = `0${hours}`;
                                }

                                if (parseInt(minutes) < 10) {
                                    minutes = `0${minutes}`;
                                }

                                b[i] = `${hours}:${minutes}`;

                                console.log(b[i]);

                                a.field.onChange(b);
                            }}
                            selected={new Date(`2000-01-01T${x}Z`)}
                            showPopperArrow={false}
                            className="form-control"
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={5}
                            onChangeRaw={(e) => e.preventDefault()}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                        />
                    </div>

                    <div className="col-auto">
                        {i !== 0 && (
                            <button
                                type="button"
                                className="btn btn-danger  me-3"
                                onClick={() => {
                                    a.field.onChange(
                                        a.field.value.filter(
                                            (x: string, j: number) => i !== j
                                        )
                                    );
                                }}
                            >
                                <BsTrash />
                            </button>
                        )}

                        {i === a.field.value.length - 1 && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    a.field.onChange([
                                        ...a.field.value,
                                        "00:00",
                                    ]);
                                }}
                            >
                                <BsPlus />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {/* <div className="row">
                <div className="col">
                    <ReactDatePicker
                        onChange={() => 0}
                        // onChange={(e) => e && setDate(e)}
                        // selected={date}
                        showPopperArrow={false}
                        className="form-control"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={5}
                        onChangeRaw={(e) => e.preventDefault()}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                    />
                </div>

                <div className="col-auto">
              
                    <button type="button" className="btn btn-primary">
                        <BsPlus />
                    </button>
                </div>
            </div> */}
        </Fragment>
    );
};
