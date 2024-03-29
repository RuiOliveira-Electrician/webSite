import React from "react";
import "./Loading.scss";
import LoadingIcon from "./LoadingIcon";

export default function Loading(props) {
    return (
        <div className="containerLoading">
            <LoadingIcon {...props} />
        </div>
    )
}