import { useState, useCallback } from "react";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { Organization } from "../types/Organizations";

export function useOrganizations() {
  // map for orgs
  const [orgLookup, setOrgLookup] = useState<Record<string, Organization>>({});

  // function to fetch org names for a list of events
  const fetchOrgDetails = useCallback(
    async (orgIds: string[]) => {
      // filter for unique IDs that we haven't fetched yet
      const idsToFetch = [...new Set(orgIds)].filter((id) => !orgLookup[id]);

      if (idsToFetch.length === 0) return;

      for (const id of idsToFetch) {
        try {
          const res = await fetch(`${LOCAL_IP}/api/organizations/${id}`);
          const data = await res.json();
          const org: Organization = data.Organization;

          setOrgLookup((prev) => ({
            ...prev,
            [id]: org,
          }));
        } catch (err) {
          console.error(`Could not fetch org ${id}:`, err);
        }
      }
    },
    [orgLookup],
  );

  return { orgLookup, fetchOrgDetails };
}
