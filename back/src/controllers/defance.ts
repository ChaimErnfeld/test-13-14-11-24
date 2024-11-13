import { Request, Response } from "express";
import organizations from "../models/organization";
import missiles from "../models/missiles";

export const getResources = async (req: Request, res: Response): Promise<void> => {
  const { organization, district } = req.body;

  try {
    let existOrganization;

    if (district) {
      existOrganization = await organizations.findOne({ name: `${organization} - ${district}` });
    }

    if (!existOrganization) {
      existOrganization = await organizations.findOne({ name: organization });
    }

    if (!existOrganization) {
      res.status(400).json({ message: "Organization not found", success: false });
      return;
    }

    const resources = existOrganization.resources.map((r) => r.name);

    res.status(200).json({ data: existOrganization.resources, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve defense tools." });
  }
};

export const getDetailsOfAmmo = async (req: Request, res: Response): Promise<void> => {
  const ammo = req.params.name;

  try {
    const details = await missiles.findOne({ name: ammo });

    res.status(200).json({ data: details, success: true });
  } catch (error) {
    res.status(400).json({ message: "error", success: false });
  }
};
