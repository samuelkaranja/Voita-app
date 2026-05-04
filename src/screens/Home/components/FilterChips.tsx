import { useDispatch } from "react-redux";
import { setFilter } from "../../../redux/slices/mapSlice";

const FilterChips = () => {
  const dispatch = useDispatch();

  return (
    <>
      <Button title="Petrol" onPress={() => dispatch(setFilter("petrol"))} />
      <Button title="Lady" onPress={() => dispatch(setFilter("lady"))} />
      <Button title="Emergency" onPress={() => dispatch(setFilter("emergency"))} />
    </>
  );
};
