import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { chaiBuilder } from "@/app/chaiBuilder";

export async function GET(_request: NextRequest, { params }: { params: any }) {
  const path = params.path.join("/");
  const { searchParams } = _request.nextUrl;
  switch (path) {
    case "project":
      const { data: project } = await chaiBuilder.getProject();
      return NextResponse.json(project);
    case "pages":
      const { data: pages } = await chaiBuilder.getPages();
      return NextResponse.json(pages);
    case "page":
      const uuid = searchParams.get("uuid") as string;
      const { data: page } = await chaiBuilder.getPage(uuid);
      return NextResponse.json(page);
    case "verify":
      const token = searchParams.get("token") as string;
      const response = await chaiBuilder.verify(token);
      return NextResponse.json(response);
    case "assets":
      const limit = searchParams.get("limit") as string;
      const offset = searchParams.get("offset") as string;
      const { data: assets } = await chaiBuilder.getAssets(limit, offset);
      return NextResponse.json(assets);
    default:
      return NextResponse.json({});
  }
}

export async function POST(_request: NextRequest, { params }: { params: any }) {
  const path = params.path.join("/");
  switch (path) {
    case "publish":
      const publishData = await _request.json();
      revalidateTag(publishData.isHomepage ? "_homepage" : publishData.slug);
      return NextResponse.json({ result: "success" });
    case "pages":
      const pageData = await _request.json();
      const { data: page } = await chaiBuilder.addPage(pageData);
      return NextResponse.json(page);
    case "authenticate":
      const authData = await _request.json(); // { password }
      const { data, error } = await chaiBuilder.authenticate(authData);
      return NextResponse.json(data ? data : error, {
        status: data ? 200 : 401,
      });
    case "upload":
      const uploadData = await _request.formData();
      const { data: upload } = await chaiBuilder.uploadAsset(uploadData);
      return NextResponse.json(upload);
    default:
      return NextResponse.json({});
  }
}

//
export async function PUT(_request: NextRequest, { params }: { params: any }) {
  const path = params.path.join("/");
  switch (path) {
    case "page":
      const pageData = await _request.json();
      await chaiBuilder.updatePage(pageData);
      return NextResponse.json({});
    case "project":
      const projectData = await _request.json();
      await chaiBuilder.updateProject(projectData);
      return NextResponse.json(projectData);
    default:
      return NextResponse.json({});
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: any },
) {
  const path = params.path.join("/");
  switch (path) {
    case "page":
      const { searchParams } = _request.nextUrl;
      const uuid = searchParams.get("uuid") as string;
      const { data: page } = await chaiBuilder.deletePage(uuid);
      return NextResponse.json(page);
    default:
      return NextResponse.json({});
  }
}
