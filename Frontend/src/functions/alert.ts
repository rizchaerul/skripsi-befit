import Swal from "sweetalert2";

export function alertError(text = "Unexpected error. Please try again") {
    return Swal.fire({
        icon: "error",
        title: "Error",
        text: text,
    });
}

export function alertSuccess(text = "") {
    return Swal.fire({
        icon: "success",
        title: "Success",
        text: text,

        showConfirmButton: false,
        timer: 2000,
    });
}

export function alertConfirm(text = "Your action cannot be undone") {
    return Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: text,
        showCancelButton: true,
    });
}
