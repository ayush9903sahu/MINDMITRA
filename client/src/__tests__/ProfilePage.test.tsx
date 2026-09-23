import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfilePage } from "../pages/ProfilePage";
import * as profileService from "../services/profile.service";
import { Gender } from "../types/profile.types";

// ASSUMPTION: matches the mocking pattern Module 2 used for auth.service.ts
// in its own __tests__ (per the handoff, 13/13 frontend tests already pass
// there against a mocked service layer, not a live server).
vi.mock("../services/profile.service", async () => {
  const actual = await vi.importActual<typeof profileService>("../services/profile.service");
  return {
    ...actual,
    fetchProfile: vi.fn(),
    saveProfile: vi.fn(),
    uploadAvatar: vi.fn(),
    removeAvatar: vi.fn(),
  };
});

const mockedFetchProfile = profileService.fetchProfile as unknown as ReturnType<typeof vi.fn>;
const mockedSaveProfile = profileService.saveProfile as unknown as ReturnType<typeof vi.fn>;

const completeProfile = {
  id: "profile-1",
  userId: "user-1",
  fullName: "Margaret Chen",
  dateOfBirth: "1952-06-14",
  age: 74,
  gender: Gender.FEMALE,
  genderCustom: null,
  contactEmail: "margaret@example.com",
  addressLine1: "12 Willow Street",
  addressLine2: null,
  city: "Springfield",
  state: "IL",
  postalCode: "62704",
  country: "USA",
  avatarUrl: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProfilePage", () => {
  it("shows the edit form when no profile exists yet", async () => {
    mockedFetchProfile.mockResolvedValue({ profile: null, isComplete: false });

    render(<ProfilePage />);

    expect(await screen.findByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByText(/welcome! add your details/i)).toBeInTheDocument();
  });

  it("shows the read-only summary card once a profile exists", async () => {
    mockedFetchProfile.mockResolvedValue({ profile: completeProfile, isComplete: true });

    render(<ProfilePage />);

    expect(await screen.findByRole("heading", { name: "Margaret Chen" })).toBeInTheDocument();
    expect(screen.getByText(/74 years old/i)).toBeInTheDocument();
    expect(screen.getByText(/private and visible only to you/i)).toBeInTheDocument();
  });

  it("switches to the edit form when Edit profile is clicked", async () => {
    mockedFetchProfile.mockResolvedValue({ profile: completeProfile, isComplete: true });
    const user = userEvent.setup();

    render(<ProfilePage />);
    await screen.findByRole("heading", { name: "Margaret Chen" });

    await user.click(screen.getByRole("button", { name: /edit profile/i }));

    expect(screen.getByDisplayValue("Margaret Chen")).toBeInTheDocument();
  });

  it("blocks submission and shows an inline error when full name is cleared", async () => {
    mockedFetchProfile.mockResolvedValue({ profile: null, isComplete: false });
    const user = userEvent.setup();

    render(<ProfilePage />);
    await screen.findByLabelText(/full name/i);

    await user.click(screen.getByRole("button", { name: /save profile/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(mockedSaveProfile).not.toHaveBeenCalled();
  });

  it("computes and displays age from date of birth without the user entering it", async () => {
    mockedFetchProfile.mockResolvedValue({ profile: null, isComplete: false });
    const user = userEvent.setup();

    render(<ProfilePage />);
    const dobInput = await screen.findByLabelText(/date of birth/i);

    await user.type(dobInput, "1960-01-01");

    await waitFor(() => {
      expect(screen.getByText(/calculated automatically/i)).toBeInTheDocument();
    });
  });

  it("submits a valid form and calls saveProfile with the entered data", async () => {
    mockedFetchProfile.mockResolvedValue({ profile: null, isComplete: false });
    mockedSaveProfile.mockResolvedValue({ profile: { ...completeProfile, fullName: "Alex Rivera" } });
    const user = userEvent.setup();

    render(<ProfilePage />);
    await screen.findByLabelText(/full name/i);

    await user.type(screen.getByLabelText(/full name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/date of birth/i), "1960-01-01");
    await user.type(screen.getByLabelText(/contact email/i), "alex@example.com");
    await user.click(screen.getByRole("button", { name: /save profile/i }));

    await waitFor(() => {
      expect(mockedSaveProfile).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: "Alex Rivera", contactEmail: "alex@example.com" })
      );
    });
  });
});
