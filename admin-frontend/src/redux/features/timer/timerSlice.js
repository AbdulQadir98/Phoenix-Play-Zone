import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timers: {}, // Store multiple timers indexed by their `cid`
};

const timerSlice = createSlice({
  name: "timers",
  initialState,
  reducers: {
    startTimer: (state, action) => {
      const { cid, startTime, remainingTime, duration, bookingId } =
        action.payload;
      state.timers[cid] = {
        startTime,
        remainingTime,
        bookingId,
        duration,
        isResetDisabled: false,
        isEndDisabled: true,
      };
    },
    updateRemainingTime: (state, action) => {
      const { cid, remainingTime } = action.payload;
      if (state.timers[cid]) {
        state.timers[cid].remainingTime = remainingTime;
        if (remainingTime <= 0) {
          state.timers[cid].remainingTime = 0;
          state.timers[cid].isEndDisabled = true;
        }
      }
    },
    resetTimer: (state, action) => {
      const { cid } = action.payload;
      if (state.timers[cid]) {
        state.timers[cid] = {
          startTime: null,
          remainingTime: null,
          bookingId: null,
          isResetDisabled: true, // Disable reset button
          isEndDisabled: true, // Disable end button
        };
      }
    },
    endTimer: (state, action) => {
      const { cid } = action.payload;
      if (state.timers[cid]) {
        state.timers[cid] = {
          startTime: null,
          remainingTime: null,
          bookingId: null,
          isResetDisabled: true, // Disable reset button
          isEndDisabled: true, // Disable end button
        };
      }
    },
    enableReset(state, action) {
      const { cid } = action.payload;
      if (state.timers[cid]) {
        state.timers[cid].isResetDisabled = false;
      }
    },
    disableReset(state, action) {
      const { cid } = action.payload;
      if (state.timers[cid]) {
        state.timers[cid].isResetDisabled = true;
      }
    },
    enableEnd(state, action) {
      const { cid } = action.payload;
      if (state.timers[cid]) {
        state.timers[cid].isEndDisabled = false;
      }
    },
    disableEnd(state, action) {
      const { cid } = action.payload;
      if (state.timers[cid]) {
        state.timers[cid].isEndDisabled = true;
      }
    },
  },
});

export const {
  startTimer,
  updateRemainingTime,
  resetTimer,
  endTimer,
  enableReset,
  disableReset,
  enableEnd,
  disableEnd,
} = timerSlice.actions;

export default timerSlice.reducer;
