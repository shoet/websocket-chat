import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootAppState } from "./store";

export const useAppSelector = useSelector.withTypes<RootAppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
