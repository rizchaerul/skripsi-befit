import { Fragment, useState } from "react";
import useSWR from "swr";
import { ApiClient } from "../../../src/clients/ApiClient";
import { SimpleAppBar } from "../../../src/components/AppBar";
import { createAuthorizeLayout } from "../../../src/components/layouts/AuthorizedLayout";
import { ImageConstants } from "../../../src/constants/ImageConstants";
import {
    alertConfirm,
    alertError,
    alertSuccess,
} from "../../../src/functions/alert";
import { createApiClient } from "../../../src/functions/create-api-client";
import { nameof } from "../../../src/functions/nameof";
import { NextPageWithLayout } from "../../_app";

const UserPage: NextPageWithLayout = () => {
    const [query, setQuery] = useState("");

    const { data, mutate } = useSWR(
        [nameof<ApiClient>("user_Get")],
        async () => await createApiClient().user_Get()
    );

    return (
        <Fragment>
            <SimpleAppBar title="Users" />

            <input
                type="search"
                className="form-control form-control-lg mt-3"
                placeholder="Search User"
                onChange={(e) => setQuery(e.target.value)}
            />

            {data === undefined && (
                <div className="text-center mt-3">
                    <small className="spinner-border spinner-border-sm ms-3" />
                </div>
            )}

            {data
                ?.filter(
                    (user) =>
                        user.name
                            ?.toUpperCase()
                            .includes(query.toUpperCase()) &&
                        user.name.toUpperCase() !== "ADMIN"
                )
                .map((user) => (
                    <div className="card my-3" key={user.id}>
                        <div className="card-body d-flex align-items-center">
                            <img
                                src={
                                    user.pictureBase64 ??
                                    ImageConstants.defaultPictureSource
                                }
                                className="rounded-circle"
                                alt=""
                                height={32}
                                width={32}
                            />

                            <h3 className="ms-3">{user.name}</h3>

                            <div className="ms-auto">
                                <button
                                    className="btn btn-dark"
                                    onClick={async () => {
                                        const result = await alertConfirm();

                                        if (result.isConfirmed) {
                                            try {
                                                await createApiClient().user_Delete(
                                                    user.id
                                                );

                                                alertSuccess();
                                                mutate();
                                            } catch (err) {
                                                console.error(err);
                                                alertError();
                                            }
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
        </Fragment>
    );
};

UserPage.getLayout = createAuthorizeLayout();

export default UserPage;
