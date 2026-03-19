
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** gym-web
- **Date:** 2026-03-18
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Member can log in and land on member dashboard
- **Test Code:** [TC001_Member_can_log_in_and_land_on_member_dashboard.py](./TC001_Member_can_log_in_and_land_on_member_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/858532b9-20ba-4ea3-b880-d89707390752
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Member dashboard shows key overview sections after login
- **Test Code:** [TC002_Member_dashboard_shows_key_overview_sections_after_login.py](./TC002_Member_dashboard_shows_key_overview_sections_after_login.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/58cac17e-ff43-4909-ba70-02354ac024a0
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Upcoming sessions section is visible on the member dashboard
- **Test Code:** [TC003_Upcoming_sessions_section_is_visible_on_the_member_dashboard.py](./TC003_Upcoming_sessions_section_is_visible_on_the_member_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/d7573863-671a-4804-b05b-d033919bd6d7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Navigate from dashboard to Programs via the Programs menu item
- **Test Code:** [TC007_Navigate_from_dashboard_to_Programs_via_the_Programs_menu_item.py](./TC007_Navigate_from_dashboard_to_Programs_via_the_Programs_menu_item.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/63724c1a-5daf-439d-8f98-9f15672dc359
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Book an available training slot successfully and verify it appears on the dashboard
- **Test Code:** [TC009_Book_an_available_training_slot_successfully_and_verify_it_appears_on_the_dashboard.py](./TC009_Book_an_available_training_slot_successfully_and_verify_it_appears_on_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/b18f7c1c-a8c4-44c6-a8eb-f351a01ec57c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Complete booking flow with notes and verify confirmation message is shown
- **Test Code:** [TC010_Complete_booking_flow_with_notes_and_verify_confirmation_message_is_shown.py](./TC010_Complete_booking_flow_with_notes_and_verify_confirmation_message_is_shown.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/0e1c85b4-1969-4cc6-a9e5-af8ed9050078
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Confirm booking after selecting a slot and entering booking notes
- **Test Code:** [TC011_Confirm_booking_after_selecting_a_slot_and_entering_booking_notes.py](./TC011_Confirm_booking_after_selecting_a_slot_and_entering_booking_notes.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/6299a1bd-660f-4c6b-8e27-9ae9526a611a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 See booking confirmation after clicking Confirm booking
- **Test Code:** [TC012_See_booking_confirmation_after_clicking_Confirm_booking.py](./TC012_See_booking_confirmation_after_clicking_Confirm_booking.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/bef53b56-0a58-479a-bf37-06a963cf746b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 After successful booking, verify the booked session is listed on the member dashboard
- **Test Code:** [TC013_After_successful_booking_verify_the_booked_session_is_listed_on_the_member_dashboard.py](./TC013_After_successful_booking_verify_the_booked_session_is_listed_on_the_member_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/2c861279-f3df-4334-80ef-e498ebc68e7d
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Attempt to book a full slot and verify 'slot unavailable' error appears and user remains on booking page
- **Test Code:** [TC014_Attempt_to_book_a_full_slot_and_verify_slot_unavailable_error_appears_and_user_remains_on_booking_page.py](./TC014_Attempt_to_book_a_full_slot_and_verify_slot_unavailable_error_appears_and_user_remains_on_booking_page.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- No error message displayed after clicking 'Confirm Booking' for a time slot marked 'Full'.
- The UI displays a success banner 'Session booked successfully!' which contradicts the expected error response for attempting to book a full slot.
- The application remained on the /booking page (URL contains '/booking') but did not provide the expected error feedback indicating the slot is full.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/145ad0e3-03ae-493f-83d8-0c041f7e62a6
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Verify 'slot unavailable' error message text is visible after trying to confirm a full slot
- **Test Code:** [TC015_Verify_slot_unavailable_error_message_text_is_visible_after_trying_to_confirm_a_full_slot.py](./TC015_Verify_slot_unavailable_error_message_text_is_visible_after_trying_to_confirm_a_full_slot.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- No time slot marked 'Full' was found on the Book Sessions page; cannot attempt to book a full slot.
- The 'slot unavailable' message could not be verified because there is no full slot on the page to trigger that message.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/314af237-4b2a-440b-abff-52a5c2ef05b9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 View program details, exercises, nutrition, and complete a daily task
- **Test Code:** [TC017_View_program_details_exercises_nutrition_and_complete_a_daily_task.py](./TC017_View_program_details_exercises_nutrition_and_complete_a_daily_task.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/cc9ea25e-4827-4565-8b05-691ddb9c1089
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Open a training program from the programs list and see program details
- **Test Code:** [TC018_Open_a_training_program_from_the_programs_list_and_see_program_details.py](./TC018_Open_a_training_program_from_the_programs_list_and_see_program_details.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/21f9d9b2-6bcd-457b-b758-2b00d6327a5f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Mark a daily task as completed and see completed state
- **Test Code:** [TC021_Mark_a_daily_task_as_completed_and_see_completed_state.py](./TC021_Mark_a_daily_task_as_completed_and_see_completed_state.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Clicking the daily task toggle did not change the 'Daily Tasks Completed' counter; it remains '0/4'.
- Task 'Drink 8 glasses of water' shows no completed/checked state after toggle clicks.
- Repeated toggle click attempts (2 times) did not update the UI state for the task.
- The dashboard counter did not increment after interactions, indicating the feature may be non-functional or not integrated.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/ba30b084-962f-4d10-a6aa-d556da037323
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Verify error message is displayed after failed save attempt
- **Test Code:** [TC022_Verify_error_message_is_displayed_after_failed_save_attempt.py](./TC022_Verify_error_message_is_displayed_after_failed_save_attempt.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Program failure message 'unable to update program' not found on the page after attempting to save.
- A success notification 'Program updated successfully!' is displayed, indicating the save did not fail and the failure message was not triggered.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/77c2ace1-c4f4-4ad9-b8b1-6bfbee6370a2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025 Add a valid weight entry and see confirmation
- **Test Code:** [TC025_Add_a_valid_weight_entry_and_see_confirmation.py](./TC025_Add_a_valid_weight_entry_and_see_confirmation.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- No visible success confirmation message was found after submitting the weight entry (no snackbar, toast, or success text like 'Entry added' / 'Weight added' / 'Successfully added').
- Weight history did not reflect the submitted value '74.6 kg'; the latest entry on the page remains 74.8 kg dated Mar 19, 2026.
- The page was scrolled to reveal potential notifications but no success confirmation was discovered.
- Add Entry was clicked (submission attempted) but no UI confirmation or updated entry was observed to validate a successful submission.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/100f0f41-d848-417b-a36b-ef53e3f3b525
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026 Successful submission updates chart and shows latest value in statistics
- **Test Code:** [TC026_Successful_submission_updates_chart_and_shows_latest_value_in_statistics.py](./TC026_Successful_submission_updates_chart_and_shows_latest_value_in_statistics.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/25316ec8-ed11-4a16-ac49-d7893f69bb07
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC027 Reject non-numeric weight with validation error
- **Test Code:** [TC027_Reject_non_numeric_weight_with_validation_error.py](./TC027_Reject_non_numeric_weight_with_validation_error.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Form did not display the validation message 'enter a valid weight' after entering non-numeric input and attempting submission.
- 'Add Entry' button was disabled or otherwise prevented the form from being submitted with the invalid weight value.
- The weight input accepted non-numeric characters ('abc'), but no visible validation feedback was presented to the user.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/d4b41b2d-30fa-4a6f-a286-59c1c766e534
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC030 Load existing weight entries and render chart and statistics
- **Test Code:** [TC030_Load_existing_weight_entries_and_render_chart_and_statistics.py](./TC030_Load_existing_weight_entries_and_render_chart_and_statistics.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/2824a0d8-7de8-45f2-9092-1a44da3b3272
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC032 Coach can open Coach Dashboard and view today's sessions schedule
- **Test Code:** [TC032_Coach_can_open_Coach_Dashboard_and_view_todays_sessions_schedule.py](./TC032_Coach_can_open_Coach_Dashboard_and_view_todays_sessions_schedule.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/2980f77e-d6f4-411e-8a23-a9017ae430d7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC033 Coach can open a member from the list and view progress stats section
- **Test Code:** [TC033_Coach_can_open_a_member_from_the_list_and_view_progress_stats_section.py](./TC033_Coach_can_open_a_member_from_the_list_and_view_progress_stats_section.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/33487cbd-e04e-43e2-8925-b5bd149e7e27
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC034 Coach can view member weight tracking section after selecting a member
- **Test Code:** [TC034_Coach_can_view_member_weight_tracking_section_after_selecting_a_member.py](./TC034_Coach_can_view_member_weight_tracking_section_after_selecting_a_member.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/4f4998ab-49c8-4fa2-a9e1-b87a0bec1e48
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC035 Coach can navigate from Coach Dashboard to Program Management via quick link
- **Test Code:** [TC035_Coach_can_navigate_from_Coach_Dashboard_to_Program_Management_via_quick_link.py](./TC035_Coach_can_navigate_from_Coach_Dashboard_to_Program_Management_via_quick_link.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/eafabe91-d7df-440b-84cc-8e99229b7b9b
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC037 Create a new training program with exercises, nutrition guides, and daily tasks
- **Test Code:** [TC037_Create_a_new_training_program_with_exercises_nutrition_guides_and_daily_tasks.py](./TC037_Create_a_new_training_program_with_exercises_nutrition_guides_and_daily_tasks.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Duration input field not found on the Create New Training Program modal (required step 'Fill "6" into the duration field' cannot be completed).
- Program creation cannot be completed or saved because a required form field (duration) is missing from the UI.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/de2fa625-e35b-4031-98cf-1dd022de402a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC038 Coach can view upcoming availability slots
- **Test Code:** [TC038_Coach_can_view_upcoming_availability_slots.py](./TC038_Coach_can_view_upcoming_availability_slots.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/e009c561-26d2-423f-b01a-3b975062c6c5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC039 Coach adds a new availability slot successfully
- **Test Code:** [TC039_Coach_adds_a_new_availability_slot_successfully.py](./TC039_Coach_adds_a_new_availability_slot_successfully.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- Capacity input field not found in the 'Add Available Time Slot' modal.
- Slot capacity cannot be set because there is no capacity control visible in the modal.
- Unable to complete the test steps requiring capacity (set capacity and verify it persisted) due to the missing UI element.
- New time slot cannot be validated for capacity because the UI does not provide a way to enter or display capacity.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/e0786eeb-ab1a-4fa6-8128-4c351521d784
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Training program progress section is visible on the member dashboard
- **Test Code:** [TC004_Training_program_progress_section_is_visible_on_the_member_dashboard.py](./TC004_Training_program_progress_section_is_visible_on_the_member_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/766536c2-24ca-4c48-9320-3cf7b0a6949c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Weight tracking stats section is visible on the member dashboard
- **Test Code:** [TC005_Weight_tracking_stats_section_is_visible_on_the_member_dashboard.py](./TC005_Weight_tracking_stats_section_is_visible_on_the_member_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/54e2e795-7802-4ff9-ab99-2085ac433d09
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Login fails with invalid credentials from the login page
- **Test Code:** [TC008_Login_fails_with_invalid_credentials_from_the_login_page.py](./TC008_Login_fails_with_invalid_credentials_from_the_login_page.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/f5ca9082-cccf-4650-95a4-b6ad607aac5c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 On slot unavailable error, verify the user remains on /booking
- **Test Code:** [TC016_On_slot_unavailable_error_verify_the_user_remains_on_booking.py](./TC016_On_slot_unavailable_error_verify_the_user_remains_on_booking.py)
- **Test Error:** TEST FAILURE

ASSERTIONS:
- No timeslot labeled 'Full' or 'Unavailable' was found on the booking page; the UI does not provide an unavailable-slot indicator to attempt.
- The test cannot simulate selecting an unavailable slot because the booking page only shows available time slot buttons (indexes 386, 387, 388, 394, 395, 400).
- Cannot verify that the user remains on '/booking' after attempting an unavailable slot because the prerequisite UI feature (a 'Full' or disabled slot) is not present.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/bfab668b-ce47-42d4-88d9-820d21ac1658/167a6317-807c-49d9-a023-16923194de4d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **70.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---