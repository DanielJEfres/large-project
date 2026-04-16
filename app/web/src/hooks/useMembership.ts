import { SERVER_IP } from "../config";
import { useAuth } from "../context/AuthContext";

export function useMembership() {
  const { token, isLoggedIn, joinedOrgIds, refreshMemberships } = useAuth();

  /**
   * Checks if the user is a member of an organization
   */
  const isOrgMember = (orgId: string | undefined): boolean => {
    if (!orgId || !joinedOrgIds) return false;
    return joinedOrgIds.has(orgId);
  };
  const toggleOrgMembership = async (orgId: string) => {
    if (!isLoggedIn) return alert("Please log in!");

    const isJoining = !isOrgMember(orgId);
    const endpoint = isJoining ? "join" : "leave";

    try {
      const response = await fetch(
        `${SERVER_IP}/api/organizations/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orgId }),
        },
      );

      if (response.ok) {
        // This keeps everything in sync across the whole app
        await refreshMemberships();
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return { isOrgMember, toggleOrgMembership };
}
