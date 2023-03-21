import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
    password: string
}

const initialState: UserState = {
    password: ''
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        delPassword: (state) => {
            state.password = ''
        }
    }
})

export const { setPassword, delPassword } = userSlice.actions
export default userSlice.reducer