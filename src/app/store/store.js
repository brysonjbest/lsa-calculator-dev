import { configureStore } from "@reduxjs/toolkit";
import delegatedSlice from "../../features/forms/delegatedSlice";

export default configureStore({
  reducer: {
    counter: delegatedSlice,
  },
});
