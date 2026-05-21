#!/usr/bin/env python3
"""
SEO comparison (WordPress vs Next.js) — from migration PRD.
Usage: pip install requests beautifulsoup4 && python scripts/seo_compare.py
"""
import csv
import time
import requests
from bs4 import BeautifulSoup

OLD_BASE = "https://www.didactirion.gr"
NEW_BASE = "https://didactirion.vercel.app"

PAGES_TO_CHECK = [
    "/",
    "/οι-καθηγητές/",
    "/oi-kathigites-mas-kai-oi/",
    "/επιτυχόντες/",
    "/epitychontes/",
    "/αυτόματος-υπολογισμός-βάσεων-μορίων/",
    "/ypologismos-morion/",
    "/γ-λυκείου/",
    "/g-lykeiou/",
    "/γενικά-θέματα-άρθρα/",
    "/genika-themata-arthra/",
    "/organization/teachers",
    "/points-calculator",
]


def fetch_seo_tags(base_url: str, path: str) -> dict:
    url = f"{base_url.rstrip('/')}{path}"
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; DidactirionSEOCompare/1.0)",
    }
    try:
        response = requests.get(
            url, headers=headers, timeout=15, allow_redirects=True, verify=False
        )
        if response.status_code != 200:
            return {
                "status": response.status_code,
                "final_url": response.url,
                "title": "N/A",
                "description": "N/A",
                "h1": "N/A",
                "canonical": "N/A",
            }

        soup = BeautifulSoup(response.content, "html.parser")
        title = soup.title.string.strip() if soup.title and soup.title.string else "Missing"
        desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find(
            "meta", attrs={"property": "og:description"}
        )
        description = (
            desc_tag["content"].strip() if desc_tag and desc_tag.get("content") else "Missing"
        )
        h1_tag = soup.find("h1")
        h1 = h1_tag.get_text().strip() if h1_tag else "Missing"
        canonical_tag = soup.find("link", rel="canonical")
        canonical = (
            canonical_tag["href"].strip()
            if canonical_tag and canonical_tag.get("href")
            else "Missing"
        )
        return {
            "status": response.status_code,
            "final_url": response.url,
            "title": title,
            "description": description,
            "h1": h1,
            "canonical": canonical,
        }
    except Exception as e:
        return {
            "status": "Error",
            "final_url": str(e),
            "title": "Error",
            "description": "Error",
            "h1": "Error",
            "canonical": "Error",
        }


def main() -> None:
    import urllib3

    urllib3.disable_warnings()
    results = []
    print("SEO migration check...\n")

    for path in PAGES_TO_CHECK:
        print(f"Checking {path}")
        old_data = fetch_seo_tags(OLD_BASE, path)
        new_data = fetch_seo_tags(NEW_BASE, path)
        results.append(
            {
                "Path": path,
                "Old Status": old_data["status"],
                "New Status": new_data["status"],
                "Old Final URL": old_data["final_url"],
                "New Final URL": new_data["final_url"],
                "Title Match": "YES" if old_data["title"] == new_data["title"] else "NO",
                "Old Title": old_data["title"],
                "New Title": new_data["title"],
                "Desc Match": "YES"
                if old_data["description"] == new_data["description"]
                else "NO",
                "Old Desc": old_data["description"],
                "New Desc": new_data["description"],
                "H1 Match": "YES" if old_data["h1"] == new_data["h1"] else "NO",
                "Old H1": old_data["h1"],
                "New H1": new_data["h1"],
                "New Canonical": new_data["canonical"],
            }
        )
        time.sleep(0.5)

    out = "seo_comparison_report.csv"
    with open(out, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)

    print(f"\nDone. Report: {out}")


if __name__ == "__main__":
    main()
