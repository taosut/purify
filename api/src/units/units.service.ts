/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as slugify from 'slug';
import { Unit } from './interfaces/unit.interface';
import { Issue } from 'src/issues/interfaces/issue.interface';
import { Report } from 'src/reports/interfaces/report.interface';
import { Project } from 'src/projects/interfaces/project.interface';
import { CreateUnitDto, EditUnitDto } from './dto/units.dto';

@Injectable()
export class UnitsService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    @InjectModel('Unit') private readonly unitModel: Model<Unit>,
    @InjectModel('Issue') private readonly issueModel: Model<Issue>,
    @InjectModel('Report') private readonly reportModel: Model<Report>
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    const project = await this.projectModel.findOne({
      slug: createUnitDto.project,
    });

    if (project) {
      return new this.unitModel({
        name: createUnitDto.name,
        project: project._id,
        slug: `${createUnitDto.project}-${slugify(createUnitDto.name)}`,
      }).save();
    } else {
      throw new NotFoundException('No such project');
    }
  }

  async delete(slug: string) {
    const unit = await this.unitModel.findOne({ slug });

    if (unit) {
      await this.reportModel.deleteMany({ unit: unit._id });
      await this.issueModel.deleteMany({ unit: unit._id });
      await this.unitModel.deleteOne({ slug });
    } else {
      throw new NotFoundException('No such unit');
    }
  }

  async edit(slug: string, fields: EditUnitDto) {
    const unit = await this.unitModel.findOne({ slug }).populate('project');
    const newName = fields.name;

    if (unit) {
      const newSlug = `${(unit.project as Project).title}-${slugify(newName)}`;

      await this.unitModel.updateOne(
        { slug },
        { slug: newSlug, name: newName }
      );
      return this.unitModel.findOne({ slug: newSlug });
    } else {
      throw new NotFoundException('No such unit');
    }
  }
}
