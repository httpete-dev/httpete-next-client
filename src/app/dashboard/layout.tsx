'use client'
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import 'toastr/build/toastr.min.css';
import DashboardHeader from "~/components/dashboardHeader";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BaseUrl, Collection, Doc, Endpoint, Workspace } from "~/model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Dashboard from "./page";
import { Globe, User, Settings, LogOutIcon, File } from "lucide-react";
import { getBaseUrls } from "~/server/baseUrls";
import DocsPage from "./docs/page";
import { UrlParams } from "~/components/sidebar/left-sidebar";
import { getLocalWorkspaces, getWorkspaces } from "~/server/workspaces";

export type DashboardPageProps = {
  workspaces: Workspace[];
  baseUrls: BaseUrl[],
  collections: Collection[],
  endpoints: Endpoint[],
  isDocumentationChanged: boolean,
  buildUrlParams: (search: string, params: UrlParams) => string;
  setActiveCollection: (cId: number) => void,
  setIsDocumentationChanged: (changed: boolean) => void,
  setEditingTitle: (editing: boolean) => void
  getCollection: (cId: number) => Collection | undefined,
  getEndpoint: (c: Collection, eId: number) => Endpoint | undefined,
  activeEndpoint: Endpoint,
  setActiveEndpoint: (endpoint: Endpoint) => void 
  updateActiveEndpoint: (eId: number) => void
  setActiveDocumentation: (doc: Doc) => void
  updateParams: (params: UrlParams) => void
  updateCollections: () => void
  setCollectionsLoading: (loading: boolean) => void
  collectionsLoading: boolean
}

export type LayoutPageProps = {
  children: React.ReactNode,
  dashboardProps: DashboardPageProps
}

export function isMobile(): boolean {
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Define mobile breakpoint (e.g., 768px)
  const mobileBreakpoint = 768; // Common breakpoint for mobile devices


  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobileAgent = /android|avantgo|blackberry|bada|bb10|iemobile|opera mini|opera mobi|phone|mobile|mini|wap/i.test(userAgent);

  return width < mobileBreakpoint || isMobileAgent;
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { data: session, status } = useSession();
  const [workspaces, setWorkspaces] = useState([] as Workspace[])
  const [isDocumentationChanged, setIsDocumentationChanged] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  
  const searchParams = useSearchParams();


  const [activeEndpoint, setActiveEndpoint] = useState({} as Endpoint)
  const [activeDocumentation, setActiveDocumentation] = useState({} as Doc)

  const updateActiveEndpoint = (eId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('endpointId', eId.toString());
    setActiveEndpoint(endpoints.find(x => x.id === eId) ?? {} as Endpoint);
  }

  const setActiveCollection = (cId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('collectionId', cId.toString());
  }

  const updateActiveWorkspace = (wId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('ws', wId.toString());
    setActiveWorkspace(workspaces?.find(x => x.id === wId) ?? {} as Workspace);
  }

  const updateActiveDocumentation = (dId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('doc', dId.toString());
  }

  const getCollection = (cId: number) => {
    return collections?.find(x => x.id === cId)
  }

  const getEndpoint = (c: Collection, eId: number) => {
    return c?.endpoints?.find(x => x.id === eId)
  }


  useEffect(() => {
    setActiveCollection(parseInt(searchParams.get('collectionId') ?? '-1'))
    updateActiveEndpoint(parseInt(searchParams.get('endpointId') ?? '-1'))
    // setActiveDocumentation(activeEndpoint.documentation ?? {} as Doc)
  }, [searchParams])

  const buildUrlParams = (search: string, prm: UrlParams) => {
    const params = new URLSearchParams(search);
    setParam('orgId')
    setParam('ws')
    setParam('endpointId')
    setParam('collectionId')

    return `?${params.toString()}`;
  }

  const currentPath = usePathname();

  const title = currentPath === '/dashboard/docs' ? 'Documentation'
    : currentPath === '/dashboard' ? 'API Interface'
      : currentPath === '/dashboard/community' ? 'Community'
        : 'Unknown Page'


  
  
  const [baseUrls, setBaseUrls] = useState([] as BaseUrl[])
  const [workspaceData, setWorkspaceData] = useState([] as Workspace[])
  const [endpoints, setEndpoints] = useState([] as Endpoint[])
  const [collections, setCollections] = useState([] as Collection[])
  const [activeWorkspace, setActiveWorkspace] = useState({} as Workspace)
  
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [localMode, setLocalMode] = useState(true);
  const updateCollections = () => {
    updateWorkspaceData();
  }



  useEffect(() => {
    localStorage.getItem('localMode') === 'true' 
      ? setLocalMode(true) 
      : setLocalMode(false);
    updateWorkspaceData();
  
  }, [session])

  function updateWorkspaceData() {
    const userId = parseInt(session?.user?.id ?? '-1');

    if (userId === -1) {
      localStorage.setItem('localMode', 'true');
      setCollectionsLoading(true);

      getLocalWorkspaces().then(res => {
        setWorkspaceData(res);
        updateActiveWorkspace(res[0]?.id ?? -1);
        updateActiveEndpoint(parseInt(searchParams?.get('endpointId') ?? '-1'));
        setCollections(res[0]?.collections ?? [])
        
        getBaseUrls(res[0]?.id ?? -1).then(ress => {
          setBaseUrls(ress);
          const params : UrlParams = {
            orgId: res[0]?.organizationId?.toString(),
            ws: res[0]?.id?.toString(),
            collectionId: res[0]?.collections?.[0]?.id?.toString(),
            endpointId: res[0]?.collections?.[0]?.endpoints?.[0]?.id?.toString()
          };
          setEndpoints(res[0]?.collections?.[0]?.endpoints ?? [])
          setCollectionsLoading(false);
          updateParams(params)
        })
      });
      return;
    }

    getWorkspaces(userId).then(res => {
      setCollectionsLoading(true);
      setWorkspaceData(res);
      updateActiveWorkspace(res[0]?.id ?? -1);
      updateActiveEndpoint(parseInt(searchParams?.get('endpointId') ?? '-1'));
      
      getBaseUrls(res[0]?.id ?? -1).then(ress => {
        setBaseUrls(ress);
        const params : UrlParams = {
          orgId: res[0]?.organizationId.toString(),
          ws: res[0]?.id.toString(),
          collectionId: res[0]?.collections[0]?.id.toString(),
          endpointId: res[0]?.collections[0]?.endpoints[0]?.id.toString()
        };
        setCollections(res[0]?.collections ?? [])
        setEndpoints(res[0]?.collections[0]?.endpoints ?? [])
        
        setCollectionsLoading(false);
        updateParams(params)
      })
    });
  }
  
  function setParam(pName: string, val?: string) {
    const pVal = val ?? searchParams.get(pName) ?? null;
    if (pVal === null) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(pName);
    } else {
      if (searchParams.get(pName) === pVal || pVal === '' || pVal === null) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set(pName, pVal);
    }
  }

  function updateParams(params: UrlParams) {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
    current.set('endpointId', params.endpointId?.toString() ?? current.get('endpointId') ?? '-1')
    current.set('collectionId', params.collectionId?.toString() ?? current.get('collectionId') ?? '-1')
    current.set('orgId', params.orgId?.toString() ?? current.get('orgId') ?? '-1')
    current.set('ws', params.ws?.toString() ?? current.get('ws') ?? '-1')

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }

  return (
    <div className={`${GeistSans.variable} custom-scrollbar`} style={{ maxWidth: '100%' }}>
      <DashboardHeader setActiveWorkspace={updateActiveWorkspace} 
        workspaces={workspaces}
        isMobile={isMobile()}
        title={title} 
        />

      {usePathname() === '/dashboard' ?
        <Dashboard
          collectionsLoading={collectionsLoading}
          setCollectionsLoading={setCollectionsLoading}
          updateCollections={updateCollections}
          updateParams={updateParams}
          getCollection={getCollection}
          getEndpoint={getEndpoint}
          baseUrls={baseUrls}
          buildUrlParams={buildUrlParams}
          collections={collections}
          isDocumentationChanged={isDocumentationChanged}
          setActiveCollection={setActiveCollection}
          activeEndpoint={activeEndpoint}
          // setActiveDocumentation={setActiveDocumentation}
          setActiveEndpoint={setActiveEndpoint}
          updateActiveEndpoint={updateActiveEndpoint}
          setIsDocumentationChanged={setIsDocumentationChanged}
          setEditingTitle={setEditingTitle}
        />
        : usePathname() === '/dashboard/docs' ?
          <DocsPage
            // activeDocumentation={activeDocumentation}
            setIsDocumentationChanged={setIsDocumentationChanged}
            // activeWorkspace={activeWorkspace!}
            isMobile={isMobile()}
            activeEndpoint={activeEndpoint}
            activeDocumentation={activeDocumentation}
            activeWorkspace={activeWorkspace!}
            setEditingTitle={setEditingTitle}
            session={session!}
          />
          : <>{children}</>
      }
    </div>
  );
}