CREATE TABLE sorted_arrays (
    id SERIAL PRIMARY KEY,
    sorting_id UUID DEFAULT uuid_generate_v4(),
    array_element TEXT
);