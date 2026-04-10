import { useState, useCallback } from "react";
import { SERVER_IP } from "../config";
import type { Organization } from "../types/Organizations";

export function useOrganizations() {
  // map for orgs
  const [orgLookup, setOrgLookup] = useState<Record<string, Organization>>({});

  // function to fetch org names for a list of events
  const fetchOrgDetails = useCallback(
    async (orgIds: string[]) => {
      // filter for unique IDs that we haven't fetched yet
      // also ensure we don't try to fetch literal "null" or "undefined" strings
      const idsToFetch = [...new Set(orgIds)].filter(
        (id) => id && id !== "null" && id !== "undefined" && !orgLookup[id]
      );

      if (idsToFetch.length === 0) return;

      // temporary object to store new orgs so we only update state once
      const fetchedOrgs: Record<string, Organization> = {};

      try {
        await Promise.all(
          idsToFetch.map(async (id) => {
            try {
              const res = await fetch(`${SERVER_IP}/api/organizations/${id}`);
              
              if (!res.ok) return; // skip if org doesn't exist
              
              const data = await res.json();
              const org: Organization = data.Organization;

              if (org) {
                fetchedOrgs[id] = org;
              }
            } catch (err) {
              console.error(`Could not fetch org ${id}:`, err);
            }
          })
        );

        // only update state if we actually found new data
        if (Object.keys(fetchedOrgs).length > 0) {
          setOrgLookup((prev) => ({
            ...prev,
            ...fetchedOrgs,
          }));
        }
      } catch (err) {
        console.error("Batch fetch failed:", err);
      }
    },
    [orgLookup]
  );

  return { orgLookup, fetchOrgDetails };
}